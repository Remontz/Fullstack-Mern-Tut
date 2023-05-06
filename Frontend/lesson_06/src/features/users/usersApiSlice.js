import {
    createSelector,
    createEntityAdapter
} from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({ // use apislice to inject endpoints into original api slice
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users', // going to users endpoint
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            }, 
            keepUnusedDataFor: 5, // Only 5 for dev, regularly 60s; 
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user // mapping over the data and setting the user.id property to the _id value
                });
                return usersAdapter.setAll(initialState, loadedUsers) // loadedUsers is response data with the id property
            },
            providesTags: (result, error, arg) => { // provides tags that could be invalidated
                if(result?.ids) { // checking to see if there is an id property, 
                    return [ 
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetUsersQuery,
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data //normalized state object with ids & entity
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUsersById,
    selectIds: selectUsersIds
    //Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)