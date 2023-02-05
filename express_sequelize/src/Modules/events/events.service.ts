import Event from './entities/event.entity';
import Workshop from './entities/workshop.entity';
import Sequelize, { Op } from 'sequelize';

type EventWithWorkshops = {
  id: number;
  name: string;
  createdAt: Date;
  workshops: Workshop[];
}


export class EventsService {

  async getWarmupEvents() {
    return await Event.findAll();
  }

  /* TODO: complete getEventsWithWorkshops so that it returns all events including the workshops
    Requirements:
    - maximum 2 sql queries
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - Don't post process query result in javascript
    Hints:
    - open the `src/events/events.service` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /events/events:
    ```json
    [
      {
        id: 1,
        name: 'Laravel convention 2021',
        createdAt: '2021-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 1,
            start: '2021-02-21 10:00:00',
            end: '2021-02-21 16:00:00',
            eventId: 1,
            name: 'Illuminate your knowledge of the laravel code base',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 2,
        name: 'Laravel convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 2,
            start: '2023-10-21 10:00:00',
            end: '2023-10-21 18:00:00',
            eventId: 2,
            name: 'The new Eloquent - load more with less',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 3,
            start: '2023-11-21 09:00:00',
            end: '2023-11-21 17:00:00',
            eventId: 2,
            name: 'AutoEx - handles exceptions 100% automatic',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 3,
        name: 'React convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 4,
            start: '2023-08-21 10:00:00',
            end: '2023-08-21 18:00:00',
            eventId: 3,
            name: '#NoClass pure functional programming',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 5,
            start: '2023-08-21 09:00:00',
            end: '2023-08-21 17:00:00',
            eventId: 3,
            name: 'Navigating the function jungle',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
    ]
    ```
     */

  async getEventsWithWorkshops() : Promise<EventWithWorkshops[]> {
    const events =  await Event.findAll({raw: true});
    const eventsWithWorkshops = await Promise.all(events.map(async event => {
      const workshops = await Workshop.findAll({raw: true, where: {eventId: event.id}})
      return {...event, workshops}
    }))
    return eventsWithWorkshops


    // return await Event.findAll({
    //   raw: true,
    //   include: [
    //     {
    //       model: Workshop,
    //       as: 'workshops',          
    //     },
    //   ],
    // });
  }
  async getFutureEventWithWorkshops() {
     /* TODO: complete getFutureEventWithWorkshops so that it returns events with workshops, that have not yet started
    Requirements:
    - only events that have not yet started should be included
    - the event starting time is determined by the first workshop of the event
    - the code should result in maximum 3 SQL queries, no matter the amount of events
    - all filtering of records should happen in the database
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - Don't post process query result in javascript
    Hints:
    - open the `src/events/events.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    - join, whereIn, min, groupBy, havingRaw might be helpful
    - in the sample data set  the event with id 1 is already in the past and should therefore be excluded
    Sample response on GET /futureevents:
    ```json
    [
        {
            "id": 2,
            "name": "Laravel convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 2,
                    "start": "2023-10-21 10:00:00",
                    "end": "2023-10-21 18:00:00",
                    "eventId": 2,
                    "name": "The new Eloquent - load more with less",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 3,
                    "start": "2023-11-21 09:00:00",
                    "end": "2023-11-21 17:00:00",
                    "eventId": 2,
                    "name": "AutoEx - handles exceptions 100% automatic",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        },
        {
            "id": 3,
            "name": "React convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 4,
                    "start": "2023-08-21 10:00:00",
                    "end": "2023-08-21 18:00:00",
                    "eventId": 3,
                    "name": "#NoClass pure functional programming",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 5,
                    "start": "2023-08-21 09:00:00",
                    "end": "2023-08-21 17:00:00",
                    "eventId": 3,
                    "name": "Navigating the function jungle",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        }
    ]
    ```
     */
    // const eventsWithWorkshops = await this.getEventsWithWorkshops()
    // const futureEvents = eventsWithWorkshops.filter(event => {
    //   console.log(new Date(event.workshops[0].start.trim()))

    //   const match = /^(\d+)-(\d+)-(\d+)/.exec(event.workshops[0].start.trim())
    //   // if (match) {
    //   //   const start_date = new Date(match[1], match[2], match[3]);
    //   // }

    //   // console.log(new Date(event.workshops[0].start) > new Date())
    //   return new Date(event.workshops[0].start) > new Date()
    // })
    // return futureEvents

    // Return today's date and time
    var currentDateTime = new Date()

    // returns the month (from 0 to 11)
    var month = currentDateTime.getMonth() + 1

    // returns the day of the month (from 1 to 31)
    var day = currentDateTime.getDate()

    // returns the year (four digits)
    var year = currentDateTime.getFullYear()

    // write output MM/dd/yyyy
    var formattedDate = year + "-" + month + "-" + day


    return await Event.findAll({
      raw: true,
      include: [{
        limit: 1,
        model: Workshop,
        as: 'workshops',
        where: {
          start: {
            [Op.gt]: new Date()
          }
        }
      }]
    })
  }
}
