import { Client } from '@microsoft/microsoft-graph-client';
import { Event } from '../types/calendar';

export class OutlookService {
  private client: Client;

  constructor(accessToken: string) {
    this.client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  async getEvents(): Promise<Event[]> {
    const response = await this.client
      .api('/me/calendar/events')
      .select('subject,start,end,bodyPreview,attendees,location')
      .get();

    return response.value.map(this.mapToEvent);
  }

  async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    const response = await this.client.api('/me/calendar/events').post({
      subject: event.title,
      start: { dateTime: event.start.toISOString(), timeZone: 'UTC' },
      end: { dateTime: event.end.toISOString(), timeZone: 'UTC' },
      body: { content: event.description },
      location: { displayName: event.location },
      attendees: event.attendees?.map((email) => ({
        emailAddress: { address: email },
        type: 'required',
      })),
    });

    return this.mapToEvent(response);
  }

  private mapToEvent(outlookEvent: any): Event {
    return {
      id: outlookEvent.id,
      title: outlookEvent.subject,
      start: new Date(outlookEvent.start.dateTime),
      end: new Date(outlookEvent.end.dateTime),
      description: outlookEvent.bodyPreview,
      location: outlookEvent.location?.displayName,
      attendees: outlookEvent.attendees?.map(
        (attendee: any) => attendee.emailAddress.address
      ),
    };
  }
}