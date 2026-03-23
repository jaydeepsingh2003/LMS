import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration?: number; // In seconds
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  videos: YouTubeVideo[];
}

/**
 * Robust YouTube Data Fetcher
 * Features: Pagination support, Quota handling, and automatic ID extraction.
 */
export const getPlaylistData = async (playlistIdOrUrl: string): Promise<YouTubePlaylist> => {
  // 0. Extract ID if URL is provided
  const playlistId = extractPlaylistId(playlistIdOrUrl);
  
  if (!API_KEY) {
    console.error('❌ YOUTUBE_API_KEY is missing in .env');
    throw new Error('Backend Configuration Error: YouTube API key or quota exceeded.');
  }

  try {
    console.log(`📡 [YouTubeService] Fetching playlist metadata for: ${playlistId}`);
    
    // 1. Get Playlist Metadata
    const playlistRes = await axios.get(`${BASE_URL}/playlists`, {
      params: { part: 'snippet', id: playlistId, key: API_KEY },
    });

    if (!playlistRes.data.items?.length) {
      throw new Error(`Playlist ${playlistId} not found or is private.`);
    }

    const pl = playlistRes.data.items[0].snippet;
    const allVideos: YouTubeVideo[] = [];
    let nextPageToken = '';

    // 2. Paginated Playlist Items Fetching (Handles courses > 50 videos)
    console.log(`📡 [YouTubeService] Syncing all video nodes...`);
    do {
      const videosRes = await axios.get(`${BASE_URL}/playlistItems`, {
        params: {
          part: 'snippet,contentDetails',
          playlistId: playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
          key: API_KEY,
        },
      });

      const items = videosRes.data.items || [];
      const pageVideos: YouTubeVideo[] = items.map((item: any) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      }));

      allVideos.push(...pageVideos);
      nextPageToken = videosRes.data.nextPageToken;
      
    } while (nextPageToken && allVideos.length < 500); // Safety limit 500

    // 3. Batch Fetch Durations (Required for progression logic)
    // YouTube API allows 50 IDs per request for 'videos' list
    console.log(`📡 [YouTubeService] Syncing durations for ${allVideos.length} nodes...`);
    const batchSize = 50;
    for (let i = 0; i < allVideos.length; i += batchSize) {
      const batch = allVideos.slice(i, i + batchSize);
      const videoIds = batch.map(v => v.id).join(',');
      
      const detailsRes = await axios.get(`${BASE_URL}/videos`, {
        params: { part: 'contentDetails', id: videoIds, key: API_KEY },
      });

      const items = detailsRes.data.items || [];
      items.forEach((item: any) => {
        const video = allVideos.find(v => v.id === item.id);
        if (video) {
          video.duration = parseISO8601Duration(item.contentDetails.duration);
        }
      });
    }

    return {
      id: playlistId,
      title: pl.title,
      description: pl.description,
      videos: allVideos,
    };
  } catch (error: any) {
    const errorData = error.response?.data?.error;
    if (errorData?.errors?.[0]?.reason === 'quotaExceeded') {
      console.error('❌ CRITICAL: YouTube API Quota Exceeded.');
      throw new Error('YouTube Quota Exceeded. Please try again tomorrow or update API key.');
    }
    console.error('❌ YouTube API Error:', errorData?.message || error.message);
    throw new Error(errorData?.message || 'Failed to fetch from YouTube');
  }
};

/**
 * Searches for high-quality educational playlists
 */
export const searchPlaylists = async (query: string = "Full Course Engineering"): Promise<any[]> => {
  if (!API_KEY) throw new Error('YOUTUBE_API_KEY missing.');

  try {
    console.log(`📡 [YouTubeService] Exploring discovery nodes for: ${query}`);
    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'playlist',
        maxResults: 10,
        relevanceLanguage: 'en',
        key: API_KEY
      }
    });

    return res.data.items.map((item: any) => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url,
      channelTitle: item.snippet.channelTitle
    }));
  } catch (error: any) {
    console.error('❌ Discovery failed:', error.message);
    return [];
  }
};

export const extractVideoId = (input: string): string => {
  if (!input) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = input.match(regExp);
  return (match && match[2].length === 11) ? match[2] : input;
};

const extractPlaylistId = (input: string): string => {

  if (input.includes('list=')) {
    return input.split('list=')[1].split('&')[0];
  }
  return input;
};

const parseISO8601Duration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
};
