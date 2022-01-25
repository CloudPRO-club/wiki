---
title: "API Gateway"
sidebar_label: "API Gateway"
sidebar_position: 2
metaTitle: "This is the meta title tag for API Gateway view page"
metaDescription: "This is the meta description for API Gateway views page"
---

> Sequence of request execution in API getway

![API Diagram](/img/SequenceOfRequestAPIGetway.png)

## Data contracts

### Queries

> getUser

``` javascript
// input
{
	"id": String
}

// output
{
	"id": String, // (emailString)
  "avatarUrl": String, // (urlString)
	"donats": DonatList, // (берем из DonationService)
	"gamePoints": Number, //(берем из ...)
	"achivki": AchivksList, //(берем из ...)
	"taskParams": { // (берем из TaskService)
		String: Object //String -> TaskIdString, Object-> TaskParmsObject
	},
	"accessTasks": []String, //() TaskIdStirng (берем из ...)
	"complateTasks": []String, //() TaskIdStirng(берем из ...)
}

```


> getCompainList

``` javascript

// output
[
{
	"id": String,
	"title": Sting,
	"description": String,
	"tasks": [
		{
			"taskId": String,
			"title": String,
			"description": String,
		},
		// {...}, {...}, ...
	]
},
// {...}, {...}, ...
]

```


> getTask

``` javascript
// input
// params "userId", "taskId", "onlyMetadata" send in url path params

// output
{
	"id": String, //
	"title": String, // (берем из ContentService)
	"description": String, // (берем из ContentService)
	"assets": {  // (берем из TaskService)
		String: String, // String -> assetNameStirng, String -> urlString
	},
	"compainID": String,
	"amountSuccesPoints": Number // (берем из TaskService)
}

```


> getTaskOfflineAchive

``` javascript
// input
{
	"taskId": String,
	"userId": String,
}

// output
// → achiveFile

```

### Commands


> confirmationDonate

``` javascript
{
	"id": String, //(номер транзакции)
	"createdAt": String //(дата успешного совершения доната)
	// Много основных параметров зависят от платежного шлюза
}


```


> createDonate → DonationService/createDonate



> createUserProfile → UserProfileService/createProfile

> updateUserProfile → UserProfileService/updateProfile

> deleteUserProfile → UserProfileService/deleteProfile


> checkTaskSolution

``` javascript
// input
{
	"userId": String,
	"taskId": String,
	"payload": Object,
}

// output
// → TaskService/checkTaskSolution

```
