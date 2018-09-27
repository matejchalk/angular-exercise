export interface Reservation {
  id: number;
  listingName: {
    name: string,
    location: string
  };
  tripDate: {
    checkInDate: Date,
    checkOutDate: Date
  };
  nights: number;
  guests: number;
  travellers: {
    avatar: string,
    name: string
  }[];
  price: number;
  status: Status;
}

export enum Status {
  Accepted = 'Accepted',
  Expired = 'Expired',
  Canceled = 'Canceled',
  Declined = 'Declined'
}

export const reservations: Reservation[] = [
  {
    id: 1,
    listingName: {
      name: 'Japanese Style, Tatami Suite',
      location: 'Shibuya, Tokyo'
    },
    tripDate: {
      checkInDate: new Date(2017, 0, 24),
      checkOutDate: new Date(2017, 0, 29)
    },
    nights: 4,
    guests: 6,
    travellers: [{ avatar: null, name: 'Gavin Andrews' }],
    price: 2100000,
    status: Status.Accepted
  },
  {
    id: 2,
    listingName: {
      name: '4 min koenju 3 Bedroom Suite',
      location: 'Shinjuku, Tokyo'
    },
    tripDate: {
      checkInDate: new Date(2017, 2, 4),
      checkOutDate: new Date(2017, 2, 12)
    },
    nights: 6,
    guests: 4,
    travellers: [{ avatar: null, name: 'Tony Murray' }],
    price: 19800000,
    status: Status.Accepted
  },
  {
    id: 3,
    listingName: {
      name: '4 min koenju 3 Bedroom Suite',
      location: 'Asakusa, Tokyo'
    },
    tripDate: {
      checkInDate: new Date(2017, 0, 24),
      checkOutDate: new Date(2017, 0, 29)
    },
    nights: 4,
    guests: 4,
    travellers: [{ avatar: null, name: 'Jesse Carroll' }],
    price: 870000,
    status: Status.Expired
  },
  {
    id: 4,
    listingName: {
      name: 'Japanese Style, Tatami Suite',
      location: 'Kyoto'
    },
    tripDate: {
      checkInDate: new Date(2017, 5, 2),
      checkOutDate: new Date(2017, 5, 3)
    },
    nights: 6,
    guests: 5,
    travellers: [{ avatar: null, name: 'Erik Armstrong' }],
    price: 2100000,
    status: Status.Accepted
  },
  {
    id: 5,
    listingName: {
      name: 'Japanese Style, Tatami Suite',
      location: 'Sendai'
    },
    tripDate: {
      checkInDate: new Date(2017, 8, 9),
      checkOutDate: new Date(2017, 8, 12)
    },
    nights: 1,
    guests: 5,
    travellers: [{ avatar: null, name: 'Jim Fields' }],
    price: 1550000,
    status: Status.Canceled
  },
  {
    id: 6,
    listingName: {
      name: 'Mesmerizing View Nova Terra',
      location: 'Kawaguchi, Osaka'
    },
    tripDate: {
      checkInDate: new Date(2017, 5, 2),
      checkOutDate: new Date(2017, 5, 3)
    },
    nights: 1,
    guests: 1,
    travellers: [{ avatar: null, name: 'Charlie Strickland' }],
    price: 450000,
    status: Status.Expired
  },
  {
    id: 7,
    listingName: {
      name: 'Groups, Families, Asakusa Suite',
      location: 'Asakusa, Tokyo'
    },
    tripDate: {
      checkInDate: new Date(2017, 5, 2),
      checkOutDate: new Date(2017, 5, 3)
    },
    nights: 5,
    guests: 6,
    travellers: [{ avatar: null, name: 'Clyde Mitchell' }],
    price: 450000,
    status: Status.Expired
  },
  {
    id: 8,
    listingName: {
      name: '4 min koenju Bedroom Suite',
      location: 'Shinjuku, Tokyo'
    },
    tripDate: {
      checkInDate: new Date(2017, 2, 4),
      checkOutDate: new Date(2017, 2, 12)
    },
    nights: 4,
    guests: 5,
    travellers: [{ avatar: null, name: 'Juan Norman' }],
    price: 2100000,
    status: Status.Accepted
  },
  {
    id: 9,
    listingName: {
      name: '4 min koenju Bedroom Suite',
      location: 'Shinjuku, Tokyo'
    },
    tripDate: {
      checkInDate: new Date(2017, 5, 2),
      checkOutDate: new Date(2017, 5, 3)
    },
    nights: 2,
    guests: 18,
    travellers: [{ avatar: null, name: 'George Crawford' }],
    price: 19800000,
    status: Status.Accepted
  },
  {
    id: 10,
    listingName: {
      name: '4 min koenju 3 Bedroom Suite',
      location: 'Asakusa, Tokyo'
    },
    tripDate: {
      checkInDate: new Date(2017, 8, 9),
      checkOutDate: new Date(2017, 8, 12)
    },
    nights: 6,
    guests: 5,
    travellers: [{ avatar: null, name: 'Austin Spencer' }],
    price: 870000,
    status: Status.Accepted
  },
  {
    id: 11,
    listingName: {
      name: 'Mesmerizing View Nova Terra',
      location: 'Shinjuku, Tokyo'
    },
    tripDate: {
      checkInDate: new Date(2017, 0, 24),
      checkOutDate: new Date(2017, 0, 29)
    },
    nights: 1,
    guests: 2,
    travellers: [{ avatar: null, name: 'Harry Ray' }],
    price: 2000000,
    status: Status.Canceled
  },
  {
    id: 12,
    listingName: {
      name: 'Groups, Families, Asakusa Suite',
      location: 'Sendai'
    },
    tripDate: {
      checkInDate: new Date(2017, 11, 25),
      checkOutDate: new Date(2017, 11, 31)
    },
    nights: 5,
    guests: 18,
    travellers: [{ avatar: null, name: 'Jeremy Maxwell' }],
    price: 870000,
    status: Status.Expired
  }
];
