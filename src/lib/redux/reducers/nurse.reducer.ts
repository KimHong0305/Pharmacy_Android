import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { AddOrderShop, Confirm, OrderShopResponse, UserPhone, UserPhoneResponse } from "../../schemas/nurse.schema";
import { BioNurseResponse, ChatRoomNurse, ChatRoomNurseResponse, ChooseRoomVacant, ChooseRoomVacantResponse, CreateMessage, CreateMessageAtRoomRespone, MessageAtRoom } from "../../schemas/nurse.schemea";

interface NurseState {
  loading: boolean;
  error: string | null;
  message: string | null;
  user: UserPhone | null;
  order: OrderShopResponse | null;
  chatRoomNurse: ChatRoomNurseResponse | null;
  chatRoomVacant: ChatRoomNurseResponse | null;
  bioNurse: BioNurseResponse | null;
  latestMessage: ChatRoomNurse | null;
  listMessage: MessageAtRoom | null;
  createMessageAtRoom: CreateMessageAtRoomRespone | null;
}

const initialState: NurseState = {
  loading: false,
  error: null,
  message: null,
  user: null,
  order: null,
  chatRoomNurse: null,
  chatRoomVacant: null,
  bioNurse: null,
  latestMessage: null,
  listMessage: null,
  createMessageAtRoom: null,
};

export const getUserByPhone = createAsyncThunk<UserPhoneResponse, string, { rejectValue: string }>(
    'nurse/getUserByPhone',
    async (phone, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('token');
    
            const response = await api.get<UserPhoneResponse>(`/user/order/shop?phone=${phone}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
    
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user phone');
        }
    }
);

export const createOrderShop = createAsyncThunk<
    OrderShopResponse, 
    AddOrderShop, 
    {rejectValue: string}
    >('nurse/createOrderShop', async (item, {rejectWithValue}) => {
        try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.post('/order/nurse', item, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
        } catch (error:any) {
        return rejectWithValue(error.response.data);
        }
    },
);

export const confirmOrderShop = createAsyncThunk<
    string, 
    Confirm, 
    {rejectValue: string}
    >('nurse/createOrderShop', async (item, {rejectWithValue}) => {
        try {
        const token = await AsyncStorage.getItem('token');
        const response = await api.put('/order/nurse', item, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
        } catch (error:any) {
        return rejectWithValue(error.response.data);
        }
    },
);

export const getBioNurse = createAsyncThunk<
  BioNurseResponse,
  void,
  {rejectValue: string}
>('nurse/getBio', async (_, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await api.get<BioNurseResponse>(`/employee/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to bio nurse',
    );
  }
});

export const getHistoryChatRoomNurse = createAsyncThunk<
  ChatRoomNurseResponse,
  void,
  {rejectValue: string}
>('nurse/getHistoryChatRoom', async (_, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await api.get<ChatRoomNurseResponse>(
      `/chat/room/employee`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch chat room history',
    );
  }
});

export const getRoomVacant = createAsyncThunk<
  ChatRoomNurseResponse,
  void,
  {rejectValue: string}
>('nurse/getRoomVacant', async (_, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await api.get<ChatRoomNurseResponse>(
      `/chat/room/vacant`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to chat room vacant',
    );
  }
});

export const chooseRoomVacant = createAsyncThunk<
  ChooseRoomVacantResponse,
  ChooseRoomVacant,
  {rejectValue: string}
>('nurse/room/choose', async (item, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.put('/chat/room/choose', item, {
      headers: {
          Authorization: `Bearer ${token}`
      },
  });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const getListMessageAtRoom = createAsyncThunk<
  MessageAtRoom,
  string,
  {rejectValue: string}
>('nurse/getMessageAtRoom', async (roomId, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await api.get<MessageAtRoom>('/chat/room/message', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        roomId,
      },
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to list chat message at room',
    );
  }
});

export const createMessageAtRoom = createAsyncThunk<
  CreateMessageAtRoomRespone,
  CreateMessage,
  {rejectValue: string}
>('nurse/create/message', async (item, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.post('/chat/create/message', item, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

const nurseSlice = createSlice({
  name: 'nurse',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
    },
    setLatestMessage(state, action) {
      state.latestMessage = action.payload; 
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUserByPhone.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.result;
        state.error = null;
      })
      .addCase(getUserByPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user phone';
      })
      .addCase(createOrderShop.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderShop.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createOrderShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user phone';
      })
      //BIO NURSE
      .addCase(getBioNurse.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBioNurse.fulfilled, (state, action) => {
        state.loading = false;
        state.bioNurse = action.payload;
        state.error = null;
      })
      .addCase(getBioNurse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bio nurse';
      })
      //CHAT ROOM HISTORY
      .addCase(getHistoryChatRoomNurse.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHistoryChatRoomNurse.fulfilled, (state, action) => {
        state.loading = false;
        state.chatRoomNurse = action.payload;
        state.error = null;
      })
      .addCase(getHistoryChatRoomNurse.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch chat room history';
      })
      //CHAT ROOM VACANT
      .addCase(getRoomVacant.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomVacant.fulfilled, (state, action) => {
        state.loading = false;
        state.chatRoomVacant = action.payload;
        state.error = null;
      })
      .addCase(getRoomVacant.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch chat room vacant';
      })
      //CHOOSE ROOM VACANT
      .addCase(chooseRoomVacant.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chooseRoomVacant.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(chooseRoomVacant.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch choose room vacant';
      })
      //GET LIST MESSAGE AT ROOM
      .addCase(getListMessageAtRoom.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListMessageAtRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.listMessage = action.payload;
        state.error = null;
      })
      .addCase(getListMessageAtRoom.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch list message at room';
      })
      //CREATE MESSAGE AT ROOM
      .addCase(createMessageAtRoom.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessageAtRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.createMessageAtRoom = action.payload;
        state.error = null;
      })
      .addCase(createMessageAtRoom.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch create message at room';
      });
  },
});

export default nurseSlice.reducer; 
export const { clearUser, setLatestMessage } = nurseSlice.actions;