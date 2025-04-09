import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart, BarChart } from "react-native-chart-kit";
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/Fontisto';
import { appColors } from '../../constants/appColors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../lib/redux/store';
import { RootState } from '../../lib/redux/rootReducer';
import { getStatisticByYear } from '../../lib/redux/reducers/statistic.reducer';
import { NavigationProp } from '../../navigators';
import SpendingStatisticScreen from '../../components/SpendingStatisticScreen';

const StatisticScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch: AppDispatch = useDispatch();

    const statisticMonth = useSelector((state: RootState) => state.statistic.statisticMonth);

    const [graph, setGraph] = useState<string>('line');
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
    const [showDetail, setShowDetail] = useState(false);

    const [allData, setAllData] = useState<{ [key: number]: { month: number, money: number }[] }>({});

    const [navigatedFromLastYear, setNavigatedFromLastYear] = useState(false);
    
    const isCurrentYear = selectedYear === currentYear;  

    // Lần đầu gọi API
    useEffect(() => {
        dispatch(getStatisticByYear(selectedYear));
    }, [dispatch, selectedYear]); 

    useEffect(() => {
        if (!statisticMonth || statisticMonth.length === 0) return;

        const filledData = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const found = statisticMonth.find(item => item.month === month);
            return { month, money: found ? found.money : 0 };
        });

        setAllData(prev => ({
            ...prev,
            [selectedYear]: filledData
        }));

        let defaultIndex = 0;

        if (navigatedFromLastYear) {
            defaultIndex = 0; 
            setNavigatedFromLastYear(false);
        } else if (selectedYear === currentYear) {
            defaultIndex = filledData.findIndex(item => item.month === currentMonth);
        } else {
            defaultIndex = filledData.findIndex(item => item.month === 12);
            if (defaultIndex === -1) defaultIndex = 11;
        }


        setSelectedMonthIndex(defaultIndex);
    }, [statisticMonth]);

    const currentYearData = (allData[selectedYear] || []).filter(item => {
        if (selectedYear < currentYear) return true;
        return item.month <= currentMonth;
    });

    const getThreeMonthData = (data: any[], index: number) => {
        const start = Math.max(index - 1, 0);
        const end = Math.min(index + 2, data.length);
        return data.slice(start, end);
    };

    const handlePrevMonth = async () => {
        if (selectedMonthIndex === 0) {
            const prevYear = selectedYear - 1;
            if (prevYear < 2024) return;

            if (!allData[prevYear]) {
                await dispatch(getStatisticByYear(prevYear));
            }

            setSelectedYear(prevYear);
        } else {
            setSelectedMonthIndex(prev => prev - 1);
        }
    };   

    const handleNextMonth = async () => {
        const currentYearData = allData[selectedYear] || [];
        const nextIndex = selectedMonthIndex + 1;
    
        const isLastMonthInYear = nextIndex >= currentYearData.length;
    
        const isCurrentYear = selectedYear === currentYear;
        const isNextMonthBeyondNow = isCurrentYear &&
            currentYearData[selectedMonthIndex]?.month >= currentMonth;
    
        if (isNextMonthBeyondNow) return;
    
        if (isLastMonthInYear) {
            const nextYear = selectedYear + 1;
            if (nextYear > currentYear) return;
    
            if (!allData[nextYear]) {
                await dispatch(getStatisticByYear(nextYear));
            }
    
            setSelectedYear(nextYear);
            setSelectedMonthIndex(0);
            setNavigatedFromLastYear(true);
        } else {
            const nextMonth = currentYearData[nextIndex]?.month;
            if (isCurrentYear && nextMonth > currentMonth) return;
    
            setSelectedMonthIndex(nextIndex);
        }
    };    

    const currentData = getThreeMonthData(currentYearData, selectedMonthIndex);
    const currentMonthSpending = currentYearData[selectedMonthIndex]?.money || 0;

    const chartData = {
        labels: currentData.map(item => `T${item.month}`),
        datasets: [{ data: currentData.map(item => item.money) }],
    };

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#f8fafc",
        backgroundGradientTo: "#f8fafc",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: "5", strokeWidth: "2" },
        barPercentage: 2,
        propsForBackgroundLines: {
            stroke: "#e2e8f0",
            strokeDasharray: "",
        },
    };

    if (!currentYearData || currentYearData.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ marginTop: 50, textAlign: 'center' }}>Đang tải dữ liệu thống kê...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('BottomTab', { screen: 'Tài khoản' })}>
                    <Icon name="arrow-left" size={25} />
                </TouchableOpacity>
                <Text style={styles.title}>Chi tiêu sức khỏe</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>Thống kê chi tiêu</Text>
                    <View style={styles.buttonGraph}>
                        <TouchableOpacity
                            style={[styles.iconButton, graph === 'line' && styles.activeIcon1]}
                            onPress={() => setGraph('line')}
                        >
                            <Icon2 name="line-graph" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.iconButton, graph === 'bar' && styles.activeIcon2]}
                            onPress={() => setGraph('bar')}
                        >
                            <Icon2 name="bar-graph" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.navi}>
                    <TouchableOpacity onPress={handlePrevMonth}>
                        <Icon3 name="left" size={20} />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon4 name="date" size={17} style={{ marginRight: 5 }} />
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>
                            T{currentYearData[selectedMonthIndex]?.month}/{selectedYear}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={handleNextMonth}>
                        <Icon3
                            name="right"
                            size={20}
                            color={selectedMonthIndex >= currentYearData.length - 1 ? '#ccc' : '#000'}
                        />
                    </TouchableOpacity>
                </View>

                {graph === 'line' ? (
                    <LineChart
                        data={chartData}
                        width={Dimensions.get("window").width - 40}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix="đ"
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                    />
                ) : (
                    <BarChart
                        data={chartData}
                        width={Dimensions.get("window").width - 40}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix="đ"
                        chartConfig={chartConfig}
                        style={styles.chart}
                    />
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '500',
                        marginTop: 10,
                        color: appColors.black
                    }}>
                        Chi tiêu tháng {currentYearData[selectedMonthIndex]?.month}:
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '500',
                        marginTop: 10,
                        color: appColors.black
                    }}>
                        {currentMonthSpending.toLocaleString('vi-VN')}đ
                    </Text>
                </View>
                <TouchableOpacity 
                    onPress={() => setShowDetail(prev => !prev)}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'flex-end', marginTop: -12}}
                >
                    <Icon name="info" size={16} color="#3b82f6" />
                    <Text style={{ color: '#3b82f6', marginLeft: 4 }}>
                        {showDetail ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                    </Text>
                </TouchableOpacity>
                {showDetail && (
                <SpendingStatisticScreen
                    month={currentYearData[selectedMonthIndex]?.month}
                    year={selectedYear}
                />
                )}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    header: {
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    title: { fontSize: 20, fontWeight: '500', marginLeft: 20 },
    content: {
        marginHorizontal: 10,
        gap: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    buttonGraph: {
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: appColors.black,
    },
    iconButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIcon1: {
        backgroundColor: appColors.gray2,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    activeIcon2: {
        backgroundColor: appColors.gray2,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
    },
    navi: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chart: {
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
});

export default StatisticScreen;