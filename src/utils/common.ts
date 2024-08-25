export interface EventData {
    id:number|null,
    title:string,
    description:string,
    facilitator:number,
    attendees:number,
    startDate:Date,
    endDate:Date,
    duration:number,
    imageUrl:string,
    department:number,
    status:number,
    eventType:number,
    createdBy:number,
};


export interface GetEvent {
    id:number|null,
    facilitator:number,
    startDate:Date|null,
    endDate:Date|null,
    department:number,
    status:number| null
};