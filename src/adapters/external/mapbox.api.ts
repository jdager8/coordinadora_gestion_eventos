class MapBoxAPI {
  private static instance: MapBoxAPI;

  private constructor() {}

  public static getInstance(): MapBoxAPI {
    if (!this.instance) {
      this.instance = new MapBoxAPI();
    }
    return this.instance;
  }

  async getCoordinates(address: string): Promise<any> {
    // Call to MapBox API
    return { lat: 0, lon: 0 };
  }

  async getNearPlaces(lat: number, lon: number): Promise<any> {
    // Call to MapBox API
    return [];
  }
}
