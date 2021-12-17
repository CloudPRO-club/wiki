---
title: "Non-functional requirements"
metaTitle: "This is the meta title tag for Non-functional requirements page"
metaDescription: "This is the meta description for Non-functional requirements page"
---

## Non-functional requirements
- **NFR-1:** Availability.

Availability is the scheduled time during which the system is actually available for use and fully operational.
>
> The system can be in an inoperative state for no more than:
> - 1 minute 26 seconds per day.
> - 43 minutes 49 seconds per month.
> (Uptime - 99.9%).

- **NFR-2:** Data integrity

Data integrity is the prevention of information loss and the preservation of the correctness of the information entered into the system.
>
> We cannot lose any data at all.
> - We store: (mail, password) - to enter the system.

- **NFR-3:** Compatibility

Compatibility is the readiness of the system for exchange with other software systems and integration with external software components
>
> There is no mobile client to connect to the platform.
> Efficiency and launch of tasks on windows, mac, linux.

- **NFR-4:** Performance

Performance is the speed of response to requests and user actions.
>
> For 1000 concurrently active users from whom 2 requests per platform per minute are received, the platform should respond in no longer than 500 milliseconds

### Priorities for non-functional requirements
![Priorities for non-functional requirements](./images/reqSheet.png)
