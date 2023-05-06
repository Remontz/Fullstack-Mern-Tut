import {
    createSelector,
    createEntityAdapter
} from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice'

const notesAdapter = createEntityAdapter({})

const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({ // use apislice to inject endpoints into original api slice
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => '/notes', // going to notes endpoint
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            }, 
            keepUnusedDataFor: 5, // Only 5 for dev, regularly 60s; 
            transformResponse: responseData => {
                const loadedNotes = responseData.map(note => {
                    note.id = note._id
                    return note // mapping over the data and setting the note.id property to the _id value
                });
                return notesAdapter.setAll(initialState, loadedNotes) // loadedNotes is response data with the id property
            },
            providesTags: (result, error, arg) => { // provides tags that could be invalidated
                if(result?.ids) { // checking to see if there is an id property, 
                    return [ 
                        { type: 'note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'note', id }))
                    ]
                } else return [{ type: 'note', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetNotesQuery,
} = notesApiSlice

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// creates memoized selector
const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data //normalized state object with ids & entity
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllNotes,
    selectById: selectNotesById,
    selectIds: selectNotesIds
    //Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)