import reducer from '../../features/bidSlice';

const initialState = {
    bidList: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

test('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
});

test('should handle placeBid.fulfilled', () => {
    const bid = { bidderName: 'salim', bidAmount: 100 };
    const action = { type: 'bids/placeBid/fulfilled', payload: bid };
    const state = reducer(initialState, action);
    expect(state.isSuccess).toBe(true);
    expect(state.bidList[0]).toEqual(bid);
});

test('should handle placeBid.rejected', () => {
    const action = { type: 'bids/placeBid/rejected', payload: 'Bid failed' };
    const state = reducer(initialState, action);
    expect(state.isError).toBe(true);
    expect(state.message).toBe('Bid failed');
});