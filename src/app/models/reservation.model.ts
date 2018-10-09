export interface Reservation {
  id: number;
  listing: {
    photo: string,
    name: string,
    location: string
  };
  tripDate: {
    checkInDate: string,
    checkOutDate: string
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
  Accepted = 'accepted',
  Expired = 'expired',
  Canceled = 'canceled',
  Declined = 'declined'
}
