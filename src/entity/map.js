class Map {
  constructor({
    posters,
    rule,
  }) {
    this.posters = posters;
    this.rule = rule;
    this.result = [];
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const deg2rad = (deg) => deg * (Math.PI / 180);
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  grouper(arr, radius, type) {
    const forResult = [];
    const nextLevel = [];
    if (arr.length > 0) {
      arr.forEach((item) => {
        const distance = this.getDistanceFromLatLonInKm(arr[0].location.coordinates[0],
          arr[0].location.coordinates[1],
          item.location.coordinates[0], item.location.coordinates[1]);
        if (distance > radius) {
          nextLevel.push(item);
        } else {
          forResult.push(item);
        }
      });
      const newResult = [...this.result];
      newResult.push({
        location: {
          coordinates: [arr[0].location.coordinates[0], arr[0].location.coordinates[1]],
        },
        type,
        ids: [...new Set(forResult.map((item) => item[`${this.rule}`]))],
      });
      this.result = newResult;
      this.grouper(nextLevel, radius, type);
    }
  }

  groupCoordinates({ radius, type }) {
    this.grouper(this.posters, radius, type);
  }

  getResult() {
    return this.result;
  }
}

module.exports = Map;
