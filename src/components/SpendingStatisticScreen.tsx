import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../lib/redux/store';
import { RootState } from '../lib/redux/rootReducer';
import { getStatisticByDate, getStatisticByMonth } from '../lib/redux/reducers/statistic.reducer';

const screenWidth = Dimensions.get('window').width;

type Props = {
    month: number;
    year: number;
};

const SpendingStatisticScreen: React.FC<Props> = ({ month, year }) => {
    const dispatch = useDispatch<AppDispatch>();

    const { statisticDay, statisticTime } = useSelector((state: RootState) => state.statistic);
    const [selectedDay, setSelectedDay] = useState<{ date: string; money: number } | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (month && year) {
            dispatch(getStatisticByMonth({ month, year }));
        }
    }, [month, year]);

    const chartData = statisticDay.map((item) => ({
        date: item.date as string,
        count: Math.round(item.money / 100000),
    }));

    const handleDayPress = (value: { date: string }) => {
        dispatch(getStatisticByDate(value.date));
        const found = statisticDay.find((item) => item.date === value.date);
        if (found) {
            setSelectedDay({ date: value.date, money: found.money });
            setModalVisible(true);
        }
    };

    const renderItem = ({ item }: { item: { date?: string; money: number } }) => (
        <View style={styles.item}>
            <Text style={styles.itemDate}>{formatDate(item.date || '')}</Text>

            <Text style={styles.itemMoney}>
                {item.money.toLocaleString()}đ
            </Text>
        </View>
    );
    
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Không rõ ngày';
    
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
    
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    };    

    const formatTime = (timeStr: string) => {
        if (!timeStr) return 'Không rõ giờ';
    
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return 'Giờ không hợp lệ';
    
        const hours = date.getHours();
        const minutes = date.getMinutes();
        
        // Định dạng giờ phút thành "15h20p"
        return `${hours}h${minutes.toString().padStart(2, '0')}p`;
    };    

    return (
        <View style={styles.container}>
            <ContributionGraph
                values={chartData}
                endDate={new Date(year, month - 1, 31)}
                numDays={31}
                width={screenWidth - 40}
                height={170}
                squareSize={25}
                gutterSize={5}
                horizontal={false}
                chartConfig={{
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                    labelColor: () => '#fff',
                }}
                tooltipDataAttrs={() => ({})}
                onDayPress={handleDayPress}
                style={{ marginLeft: 20 }}
            />

            <Text style={styles.subtitle}>Chi tiết các ngày chi tiêu</Text>
            <FlatList
                data={statisticDay}
                keyExtractor={(item, index) => item.date ? item.date : `key-${index}`}
                renderItem={renderItem}
                scrollEnabled={false}
            />


            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chi tiêu ngày {selectedDay?.date}</Text>
                        <ScrollView style={{width: '100%'}}>
                            {statisticTime
                                .map((item, index) => (
                                    <View key={index} style={styles.item}>
                                        <Text style={styles.itemDate}>
                                            {item.time ? formatTime(item.time) : 'Không rõ giờ'}
                                        </Text>
                                        <Text style={styles.itemMoney}>
                                            {item.money.toLocaleString()}đ
                                        </Text>
                                    </View>
                                ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#ffffff',
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#475569',
        marginVertical: 12,
    },
    item: {
        backgroundColor: '#f1f5f9',
        flexDirection: 'row',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        justifyContent:'space-between',
        alignItems: 'center',
    },
    itemDate: {
        fontSize: 14,
        color: '#334155',
    },
    itemMoney: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        color: '#0f172a',
        fontWeight: '600',
        marginBottom: 10,
    },
    modalMoney: {
        fontSize: 20,
        color: '#1d4ed8',
        fontWeight: '700',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#94a3b8',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default SpendingStatisticScreen;