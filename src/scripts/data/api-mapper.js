import Map from '../utils/map';

export async function reportMapper(report) {
  const { lat, lon, location = {}, ...rest } = report;

  return {
    ...rest,
    lat,
    lon,
    location: {
      ...location,
      placeName: lat && lon
        ? await Map.getPlaceNameByCoordinate(lat, lon)
        : null,
    },
  };
}

