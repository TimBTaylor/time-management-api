# Time Management API

I created this API to use in the client side of my Time Management.

## Description

This API allows you to create a user or admin account by using the Google OAuth login, create a company that links with the admin account, create jobs, and submit time entrys for those jobs.

## Technologies Used

- Express.js
- MySQL
- Passport Google OAuth

## Installation

- Download the file from this repository
- Navigate to the file via your CLI

### Executing program

- Run the following code in your CLI while in the project directory

```
npm install
```

or

```
yarn install
```

- once it is finished installing the dependencies run the follow command

```
node server.js
```

- Download the npm package nodemon for best use in developement mode

## Routes

### Update users company information

`PUT user/update-company`

- Body
  `email, newCompanyNumber, tableName`
- Example

```
await axios({
      method: "put",
      url: "https://ecommersappbytim.herokuapp.com/auth/register",
      header: { "Content-Type": "application/json" },
      data: {
        email,
        newCompanyNumber,
        tableName
      },
    })
```

### Update users Admin status

`PUT user/update-admin-status`

- Body
  `firstName, lastName, email, date, profileImage, companyNumber`
- Example

```
await axios({
      method: "put",
      url: "https://ecommersappbytim.herokuapp.com/auth/login",
      header: { "Content-Type": "application/json" },
      data: {
        firstName,
        lastName,
        email,
        date
        profileImage,
        companyNumber
      },
    })
```

### Delete user account

`DELETE user/delete-account`

- Body
  `email, accountType`
- Example

```
await axios({
      method: "DELETE",
      url: `https://ecommersappbytim.herokuapp.com/info/${userId}/update-user`,
      header: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        accountType
      },
    })
```

### Add company

`POST company/new-company`

- Body
  `companyName, adminEmail, companyNumber`
- Example

```
await axios({
      method: "post",
      url: `https://ecommersappbytim.herokuapp.com/address/${userId}/new-address`,
      header: { "Content-Type": "application/json" },
      data: {
        companyName,
        adminEmail,
        companyNumber
      },
    })
```

### Update company name

`PUT company/new-name`

- Body
  `newCompanyName, adminEmail`
- Example

```
await axios({
      method: "put",
      url: `https://ecommersappbytim.herokuapp.com/address/${userId}/delete-address`,
      header: { "Content-Type": "application/json" },
      data: {
        newCompanyName,
        adminEmail
      },
    })
```

### Create new job

`POST jobs/new-job`

- Body
  `companyNumber, jobName, jobPo, jobFor, comments`
- Example

```
await axios({
      method: "post",
      url: `https://ecommersappbytim.herokuapp.com/address/${userId}/update-address`,
      header: { "Content-Type": "application/json" },
      data: {
        companyNumber,
        jobName,
        jobPo,
        jobFor,
        comments
      },
    })
```

### Delete job

`DELETE jobs/delete-job`

- Body
  `jobName, jobPo`
- Example

```
await axios({
      method: "delete",
      url: `https://ecommersappbytim.herokuapp.com/card/${userId}/add-card`,
      header: { "Content-Type": "application/json" },
      data: {
        jobName,
        jobPo
      },
    })
```

### Add time entry

`POST time/new-time-entry`

- Body
  `adminId, userId, jobName, hours, notes, companyNumber, todayDate`
- Example

```
await axios({
      method: "POST",
      url: `https://ecommersappbytim.herokuapp.com/card/${userId}/delete-card`,
      header: { "Content-Type": "application/json" },
      data: {
          adminId,
          userId,
          jobName,
          hours,
          notes,
          companyNumber,
          todayDate
      },
    })
```

### Delete time entry

`DELETE time/delete-time-entry`

- Body
  `timeEntryId, id, typeOfId, jobName, date`
- Example

```
await axios({
      method: "delete",
      url: `https://ecommersappbytim.herokuapp.com/card/${userId}/update-card`,
      header: { "Content-Type": "application/json" },
      data: {
          timeEntryId,
          id,
          typeOfId,
          jobName,
          date
      },
    })
```

### Get all time entrys for a user

`GET time/all-time-entries-user`

- Body
  `id, typeOfId`
- Example

```
await axios({
        method: "get",
        url: `https://ecommersappbytim.herokuapp.com/cart/${userId}/add-to-cart`,
        header: {
          "Content-Type": "application/json",
        },
        data: {
          id,
          typeOfId
        },
      })
```

### Get all time entrys for a company

`GET`

- Body
  `companyNumber`
- Example

```
await axios({
      method: "get",
      url: `https://ecommersappbytim.herokuapp.com/cart/${userId}/delete-from-cart`,
      header: { "Content-Type": "application/json" },
      data: {
        companyNumber
      },
    })
```
