---
title: "User Profile service view"
sidebar_label: "User Profile service view"
sidebar_position: 8
metaTitle: "This is the meta title tag for  User Profile service view page"
metaDescription: "This is the meta description for  User Profile service views page"
---


![Learning application](/img/userProfileServiceDB.png)

## Data contracts

### Queries

> getProfile

``` javascript
// input
// id send in query params url
{
	"id": String
}

// output
{
	"id": String, // (emailString)
  "avatarUrl": String, // (urlString)
}

```




### Commands


> createProfile

``` javascript
// input
// id, avatarUrl send in query params url
{
	"id": String, // (emailString)
  "avatarUrl": String, // (urlString)
}



```


> updateProfile

``` javascript
// input
// id, avatarUrl send in query params url
{
	"id": String, // (emailString)
  "avatarUrl": String, // (urlString)
}




```


> deleteProfile

``` javascript
// input
// id send in query params url
{
	"id": String, // (emailString)
}




```
