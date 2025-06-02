import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, TextInput, Modal, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Picker} from '@react-native-picker/picker';
import { useNavigation, useRoute  } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getHistoryOrder } from '../../lib/redux/reducers/order.reducer';
import { RootState } from '../../lib/redux/rootReducer';
import { AppDispatch } from '../../lib/redux/store';
import type { NavigationProp } from '../../navigators/index';
import { TextComponent } from '../../components';
import { createFeedback, deleteFeedback, getFeedbackByUser, updateFeedback } from '../../lib/redux/reducers/feedback.reducer';
import { Order, OrderItem } from '../../lib/schemas/order.schema';

const HistoryOrderScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch();
    const route = useRoute();
    const { active } = route.params as { active: string };
    const [activeTab, setActiveTab] = useState(active);
    const { orders } = useSelector((state: RootState) => state.order);
    const {feedbackUser} = useSelector((state: RootState) => state.feedback);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [showEditReview, setShowEditReview] = useState(false);
    const [showDeleteReview, setShowDeleteReview] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<OrderItem | null>(null);
    const [reviewText, setReviewText] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState('');

    //CREATE FEEDBACK DIALOG
    const handleOpenReviewDialog = (order: Order) => {
      setSelectedOrder(order);
      setSelectedProduct(order.orderItemResponses[0] || null);
      setShowReviewDialog(true);
    };

    const handleSubmitReview = async () => {
      const newFeedback = {
        productId: selectedProduct?.productId,
        priceId: selectedProduct?.priceId,
        feedback: reviewText,
      };
      console.log(newFeedback);
      try {
        await dispatch(createFeedback(newFeedback)).unwrap();
        Alert.alert('Đánh giá thành công!')
        dispatch(getFeedbackByUser());
        handleCloseReviewDialog();
      } catch (error:any) {
         Alert.alert('Lỗi: ', error.message);
      }
    };

    const handleCloseReviewDialog = () => {
      setShowReviewDialog(false);
      setReviewText('');
    };

    //EDIT FEEDBACK DIALOG
    const handleEditReview = (feedbackId: string) => {
      setShowEditReview(true);
      setSelectedFeedback(feedbackId);
    };

    const handleSubmitUpdate = async (feedbackId: string) => {
      const update = {
        id: feedbackId,
        feedback: reviewText,
      };
      //console.log(update)
      try {
        await dispatch(updateFeedback(update)).unwrap();
        Alert.alert('Cập nhật đánh giá thành công!');
        setShowEditReview(false);
        setReviewText('');
        dispatch(getFeedbackByUser());
      } catch (error) {
        Alert.alert('Cập nhật đánh giá thất bại!');
      }
    };
    
    const handleCloseEditReview = () => {
      setShowEditReview(false);
    }

    //DELETE FEEDBACK DIALOG
    const handleDeleteReview = (feebackId: string) => {
      setShowDeleteReview(true);
      setSelectedFeedback(feebackId);
    };

    const handleConfirmDelete = async (feedbackId: string) => {
      try {
        await dispatch(deleteFeedback(feedbackId)).unwrap();
        setShowDeleteReview(false);
        dispatch(getFeedbackByUser());
        Alert.alert('Xóa đánh giá thành công');
      } catch (error) {
        Alert.alert('Xoá đánh giá thất bại!');
      }
    };
    
    const handleCloseDeleteReview = () => {
      setShowDeleteReview(false);
    };


    useEffect(() => {
        dispatch(getHistoryOrder());
        dispatch(getFeedbackByUser());
    }, [dispatch]);

    const filteredHistory = orders.filter((order) => {
        switch (activeTab) {
            case "processing":
                return !order.isConfirm && (order.status === "SUCCESS" || order.paymentMethod === "CASH");
            case "shipping":
                return order.isConfirm && order.status !== "CANCELLED";
            case "cancelled":
                return order.status === "FAILED" && !order.isConfirm;
            case "pendingPayment":
                return order.status === "PENDING" && order.paymentMethod !== "CASH";
            case "review":
                return order.isConfirm && (order.status === "SUCCESS" || order.paymentMethod === "CASH");
            case "reviewed":
                return false;
            default:
                return true;
        }
    });

    const filteredFeedbacks = activeTab === 'reviewed' ? feedbackUser : [];

    const tabs = [
        { label: 'Đang xử lý', value: 'processing' },
        { label: 'Chờ thanh toán', value: 'pendingPayment' },
        { label: 'Đang giao', value: 'shipping' },
        { label: 'Đã hủy', value: 'cancelled' },
        { label: 'Đánh giá', value: 'review' },
        { label: 'Đã đánh giá', value: 'reviewed' },
    ];

    return (
      <View style={styles.container}>
        {/* Thanh tiêu đề */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={25} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Đơn đã mua</Text>
        </View>

        {/* Tabs để chọn trạng thái đơn hàng */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setActiveTab(tab.value)}
              style={[
                styles.tabButton,
                activeTab === tab.value && styles.activeTab,
              ]}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.value && styles.activeTabText,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List Feedback By User */}

        {/* Danh sách đơn hàng */}
        <ScrollView style={styles.content}>
          {filteredHistory.length === 0 && activeTab !== 'reviewed' ? (
            <Text style={styles.noOrderText}>Không có đơn hàng nào.</Text>
          ) : (
            filteredHistory.map(order => (
              <View key={order.id} style={styles.orderContainer}>
                {/* Mã đơn hàng + Trạng thái */}
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderDate}>
                      Ngày đặt: {order.orderDate}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge]}>
                    <Text
                      style={[
                        order.isConfirm === false
                          ? styles.processingText
                          : styles.shippingText,
                      ]}>
                      {order.isConfirm === false
                        ? 'Đang xử lý'
                        : 'Đang giao hàng'}
                    </Text>
                  </View>
                </View>

                {/* Sản phẩm đầu tiên */}
                <View style={styles.orderContent}>
                  {order.orderItemResponses.length > 0 && (
                    <View style={styles.productContainer}>
                      <Image
                        source={{uri: order.orderItemResponses[0].image}}
                        style={styles.productImage}
                      />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>
                          {order.orderItemResponses[0].productName}
                        </Text>
                        <Text style={styles.productDetails}>
                          x{order.orderItemResponses[0].quantity}
                        </Text>
                        <Text style={styles.productPrice}>
                          Giá:{' '}
                          {order.orderItemResponses[0].price.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Nếu có nhiều sản phẩm hơn */}
                  {order.orderItemResponses.length > 1 && (
                    <Text style={styles.moreProducts}>
                      + {order.orderItemResponses.length - 1} sản phẩm khác
                    </Text>
                  )}
                </View>

                {/* Phương thức thanh toán + Tổng tiền */}
                <View style={styles.orderFooter}>
                  <View>
                    <Text style={styles.paymentMethod}>
                      Phương thức thanh toán:{' '}
                      <Text style={styles.paymentText}>
                        {order.paymentMethod}
                      </Text>
                    </Text>

                    {order.paymentMethod !== 'CASH' && (
                      <View
                        style={[
                          styles.paymentStatus,
                          order.status === 'PENDING'
                            ? styles.pending
                            : order.status === 'SUCCESS'
                            ? styles.success
                            : order.status === 'FAILED'
                            ? styles.failed
                            : styles.cancelled,
                        ]}>
                        <Text style={styles.paymentStatusText}>
                          {order.status === 'PENDING' && 'Chờ thanh toán'}
                          {order.status === 'SUCCESS' && 'Đã thanh toán'}
                          {order.status === 'FAILED' && 'Thanh toán thất bại'}
                          {order.status === 'CANCELLED' && 'Đã hủy'}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style = {{marginTop: 15, right: 20}}>
                    <Text style={styles.totalPrice}>
                      Tổng tiền: {order.newTotalPrice.toLocaleString()} VND
                    </Text>
                  </View>
                </View>

                {/* Tab Review */}
                {activeTab === 'review' && (
                  <>
                    <TouchableOpacity
                      style={styles.reviewButton}
                      onPress={() => handleOpenReviewDialog(order)}>
                      <TextComponent text="Đánh giá" size={15} color="#fff" />
                    </TouchableOpacity>

                    <Modal
                      visible={showReviewDialog}
                      transparent
                      animationType="fade">
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <Text style={styles.titleReview}>
                            Đánh giá sản phẩm
                          </Text>

                          {/* Dropdown chọn sản phẩm */}
                          <Text style={styles.label}>Chọn sản phẩm:</Text>

                          {selectedOrder && (
                            <Picker
                              selectedValue={selectedProduct?.id}
                              onValueChange={itemValue => {
                                const selected =
                                  selectedOrder.orderItemResponses.find(
                                    product => product.productId === itemValue,
                                  );
                                setSelectedProduct(selected || null);
                              }}>
                              {selectedOrder.orderItemResponses.map(product => (
                                <Picker.Item
                                  key={product.productId}
                                  label={product.productName}
                                  value={product.productId}
                                />
                              ))}
                            </Picker>
                          )}

                          {/* Textarea nhập đánh giá */}
                          <TextInput
                            value={reviewText}
                            onChangeText={setReviewText}
                            placeholder="Nhập đánh giá của bạn"
                            style={styles.textarea}
                            multiline
                          />

                          {/* Nút Hủy và Đánh giá */}
                          <View style={styles.buttonContainer}>
                            <TouchableOpacity
                              style={styles.submitButton}
                              onPress={handleSubmitReview}>
                              <Text style={styles.submitText}>Đánh giá</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.cancelButton}
                              onPress={handleCloseReviewDialog}>
                              <Text style={styles.cancelText}>Hủy</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </>
                )}
              </View>
            ))
          )}

          {activeTab === 'reviewed' && (
            <View>
              {filteredFeedbacks.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.noOrderText}>Không có đánh giá nào.</Text>
                </View>
              ) : (
                filteredFeedbacks.map(item => (
                  <View key={item.id} style={styles.feedbackCard}>
                    <View style={styles.productContainerReview}>
                      <Text style={styles.productNameReview}>
                        {item.productName}
                      </Text>
                    </View>
                    <View style={styles.headerReview}>
                      <View style={styles.userContainer}>
                        <Image
                          source={
                            item.avatar
                              ? {uri: item.avatar}
                              : require('../../assets/images/avatar.jpg')
                          }
                          style={styles.avatar}
                        />
                        <Text style={styles.username}>{item.username}</Text>
                      </View>
                      <Text style={styles.date}>{item.createDate}</Text>
                    </View>
                    <View style={styles.contentContainer}>
                      <Text style={styles.feedback}>{item.feedback}</Text>
                      <View style={styles.actions}>
                        {
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditReview(item.id)}>
                            <Icon name="edit" color="blue" />
                          </TouchableOpacity>
                        }
                        {
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteReview(item.id)}>
                            <Icon name="trash" color="red" />
                          </TouchableOpacity>
                        }
                      </View>
                    </View>
                  </View>
                ))
              )}

              {showEditReview && (
                <Modal
                  visible={showEditReview}
                  transparent
                  animationType="fade">
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '500',
                          alignSelf: 'center',
                          marginBottom: 10,
                        }}>
                        Chỉnh sửa đánh giá
                      </Text>
                      <TextInput
                        value={reviewText}
                        onChangeText={setReviewText}
                        placeholder="Nhập đánh giá của bạn"
                        style={styles.textarea}
                        multiline
                      />
                      {/* Nút Hủy và Đánh giá */}
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.submitButton}
                          onPress={() => handleSubmitUpdate(selectedFeedback)}>
                          <Text style={styles.submitText}>Cập nhật</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={handleCloseEditReview}>
                          <Text style={styles.cancelText}>Hủy</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}

              {showDeleteReview && (
                <Modal
                  visible={showDeleteReview}
                  transparent
                  animationType="fade">
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '500',
                          alignSelf: 'center',
                          textAlign: 'center',
                          marginBottom: 10,
                        }}>
                        Bạn có chắc chắn muốn xoá đánh giá này không?
                      </Text>
                      {/* Nút Hủy và Đánh giá */}
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.submitButton}
                          onPress={() => handleConfirmDelete(selectedFeedback)}>
                          <Text style={styles.submitText}>Có</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={handleCloseDeleteReview}>
                          <Text style={styles.cancelText}>Hủy</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignSelf: 'center',
    marginLeft: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 40,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  content: {
    height: '85%',
    padding: 15,
    backgroundColor: '#f1f5f9',
  },
  noOrderText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  processingText: {
    color: '#ed7532',
  },
  shippingText: {
    color: '#1E90FF',
  },
  orderContent: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productDetails: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
  },
  productPrice: {
    fontSize: 12,
    marginTop: 20,
    fontWeight: '400',
    textAlign: 'right',
  },
  moreProducts: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
  },
  paymentText: {
    fontWeight: 'bold',
  },
  paymentStatus: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 5,
  },
  pending: {
    backgroundColor: '#FFD700',
  },
  success: {
    backgroundColor: '#32CD32',
  },
  failed: {
    backgroundColor: '#FF4500',
  },
  cancelled: {
    backgroundColor: '#808080',
  },
  paymentStatusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  //Review
  reviewButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  titleReview: {
    fontWeight: '500',
    fontSize: 20,
    alignSelf: 'center',
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    marginLeft: 9,
  },
  textarea: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  cancelText: {
    color: '#000',
  },
  submitText: {
    color: '#fff',
  },
  //REVIEWED
  reviewedContainer: {
    backgroundColor: '#f1f5f9',
    top: 15
  },
  emptyContainer: {
    alignItems: 'center',
  },
  feedbackCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 10,
  },
  productContainerReview: {
    backgroundColor: '#E5E7EB',
    padding: 5,
    borderRadius: 6,
    marginBottom: 5,
  },
  productNameReview: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  headerReview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedback: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#D1FAE5',
    marginLeft: 5,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#FECACA',
    marginLeft: 5,
  },
});

export default HistoryOrderScreen;
