import { TuskDrift } from './tuskDriftInit.ts';
import express from 'express';
import type { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;

app.use(express.json());

const convertCelsiusToFahrenheit = (celsius: number) => {
  return (celsius * 9/5) + 32;
};

// GET /api/weather-activity - Get location from IP, weather, and activity recommendations
app.get('/api/weather-activity', async (req: Request, res: Response) => {
  try {
    // First API call: Get user's location from IP
    const locationResponse = await axios.get('http://ip-api.com/json/');
    const { city, lat, lon, country } = locationResponse.data;

    // Business logic: Determine activity based on location
    const isCoastal = Math.abs(lon) > 50 || Math.abs(lat) < 30;

    // Second API call: Get weather for the location
    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const weather = weatherResponse.data.current_weather;

    weather.temperature = convertCelsiusToFahrenheit(weather.temperature);

    // Business logic: Recommend activity based on weather
    let recommendedActivity = 'Play a board game';
    if (weather.temperature > 40) {
      recommendedActivity = 'Too hot - stay indoors';
    } else if (weather.temperature > 20 && weather.windspeed < 20) {
      recommendedActivity = isCoastal ? 'Beach day!' : 'Perfect for hiking!';
    } else if (weather.temperature < 10) {
      recommendedActivity = 'Hot chocolate weather';
    } else if (weather.windspeed > 30) {
      recommendedActivity = 'Too windy - indoor activities recommended';
    } else {
      recommendedActivity = 'Nice day for a walk';
    }

    // Third API call: Get a random activity suggestion
    const activityResponse = await axios.get('https://bored-api.appbrewery.com/random');
    const alternativeActivity = activityResponse.data;

    res.json({
      location: {
        city,
        country,
        coordinates: { lat, lon },
        isCoastal
      },
      weather: {
        temperature: weather.temperature,
        windspeed: weather.windspeed,
        weathercode: weather.weathercode,
        time: weather.time
      },
      recommendations: {
        weatherBased: recommendedActivity,
        alternative: {
          activity: alternativeActivity.activity,
          type: alternativeActivity.type,
          participants: alternativeActivity.participants
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather and activity data' });
  }
});

// GET /user/:id - Get random user with seed parameter
app.get('/api/user/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://randomuser.me/api/?seed=${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// POST /user - Create random user (no seed)
app.post('/api/user', async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /post/:id - Get post with comments
app.get('/api/post/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch post and comments in parallel
    const [postResponse, commentsResponse] = await Promise.all([
      axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`),
      axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
    ]);

    res.json({
      post: postResponse.data,
      comments: commentsResponse.data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post data' });
  }
});

// POST /post - Create new post
app.post('/api/post', async (req: Request, res: Response) => {
  try {
    const { title, body, userId } = req.body;

    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
      title,
      body,
      userId
    });

    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// DELETE /api/post/:id - Delete post
app.delete('/api/post/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);

    res.json({ message: `Post ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const main = async () => {
  app.listen(PORT, () => {
    TuskDrift.markAppAsReady();
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('\nAvailable endpoints:');
    console.log('  GET /api/weather-activity     - Recommend activity based on location and weather');
    console.log('  GET /api/user/:id             - Get user');
    console.log('  POST /api/user                - Create user');
    console.log('  GET /api/post/:id             - Get post, with comments');
    console.log('  POST /api/post                - Create post');
    console.log('  DELETE /api/post/:id          - Delete post');
  });
};

main();


