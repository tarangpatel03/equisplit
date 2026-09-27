import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Member } from '@/types';

type MemberState = {
  members: Member[];
};

const initialState: MemberState = {
  members: [],
};

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers(state, action: PayloadAction<Member[]>) {
      state.members = action.payload;
    },
    addMember(state, action: PayloadAction<Member>) {
      state.members.push(action.payload);
    },
    removeMember(state, action: PayloadAction<string>) {
      state.members = state.members.filter(m => m.id !== action.payload);
    },
  },
});

export const { setMembers, addMember, removeMember } = memberSlice.actions;

export default memberSlice.reducer;
