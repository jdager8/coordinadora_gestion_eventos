import axios from 'axios';
import { bbox } from '@turf/bbox';
import { AllGeoJSON, point } from '@turf/helpers';
import { buffer } from '@turf/buffer';

import { MapBoxException } from '../../application/exceptions/exceptions';

import FormatString from '../../helpers/format.string';
import { EventNearPlacesDTO } from '../../domain/entities/dto/events.dto';

class MapBoxAPI {
  private static instance: MapBoxAPI;
  private API_URL: string;
  private TOKEN: string;
  private TYPES_LIMIT: number;
  private RADIUS_LIMIT: number;
  private FILTER_TYPES: string;

  private constructor(config: any) {
    this.API_URL = config.EM_MAPBOX_API_URL;
    this.TOKEN = config.EM_MAPBOX_TOKEN;
    this.TYPES_LIMIT = config.EM_MAPBOX_TYPES_LIMIT;
    this.FILTER_TYPES = config.EM_MAPBOX_FILTER_TYPES;
    this.RADIUS_LIMIT = config.EM_MAPBOX_RADIUS_LIMIT;
  }

  public static getInstance(config: any): MapBoxAPI {
    if (!this.instance) {
      this.instance = new MapBoxAPI(config);
    }
    return this.instance;
  }

  async getCoordinates(
    address: string,
  ): Promise<{ latitude: string; longitude: string } | undefined> {
    const url = FormatString.templateString(this.API_URL, [address]);

    try {
      const response = await axios.get(url, {
        params: {
          access_token: this.TOKEN,
          limit: 1,
        },
      });

      if (response.data.features.length > 0) {
        return {
          latitude: response.data.features[0].center[1],
          longitude: response.data.features[0].center[0],
        };
      }
    } catch (error: any) {
      console.error(`Error getting coordinates: ${error}`);
      throw new MapBoxException('Could not get coordinates. Try again later');
    }
  }

  async getNearPlaces(
    latitude: string,
    longitude: string,
  ): Promise<EventNearPlacesDTO | undefined> {
    const url = FormatString.templateString(this.API_URL, [
      `${longitude}, ${latitude}`,
    ]);

    try {
      const response = await axios.get(url, {
        params: {
          access_token: this.TOKEN,
          limit: this.TYPES_LIMIT,
          types: this.FILTER_TYPES,
          bbox: this.generateBbox(latitude, longitude).join(','),
        },
      });

      if (response.data.features.length > 0) {
        return response.data.features.map((place: any) => {
          return {
            id: place.id,
            name: place.text,
            address: place.place_name,
            coordinates: {
              latitude: place.center[1],
              longitude: place.center[0],
            },
          };
        });
      }
    } catch (error: any) {
      console.error(`Error getting near places: ${error}`);
      throw new MapBoxException('Could not get near places. Try again later');
    }
  }

  private generateBbox(lat: string, lon: string): number[] {
    const originalPoint = point([parseFloat(lon), parseFloat(lat)]);
    const resultBbox = buffer(originalPoint, this.RADIUS_LIMIT / 1000, {
      units: 'kilometers',
    });
    const bboxArray = bbox(resultBbox as unknown as AllGeoJSON);
    return bboxArray;
  }
}

export default MapBoxAPI;
