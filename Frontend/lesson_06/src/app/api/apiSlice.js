import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react' //fechBaseQuery similar to axios

export const apiSlice = createApi({ 
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }), // providing the base url -- change at deployment
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})