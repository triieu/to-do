import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import NavBar from '~/components/NavBar';

const CalendarScreen = ({ navigation }) => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startDate = new Date(2024, 0, 1); // January 2024
  const endDate = new Date(2025, 11, 31); // December 2025

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarData = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth + firstDayOfMonth;
    const rows = Math.ceil(totalDays / 7);

    const calendarData = [];
    for (let i = 0; i < rows * 7; i++) {
      if (i < firstDayOfMonth || i >= daysInMonth + firstDayOfMonth) {
        calendarData.push('');
      } else {
        calendarData.push(i - firstDayOfMonth + 1);
      }
    }
    return calendarData;
  };

  const renderDay = ({ item }) => {
    const isToday =
      item === today.getDate() &&
      selectedMonth.getMonth() === today.getMonth() &&
      selectedMonth.getFullYear() === today.getFullYear();

    return (
      <TouchableOpacity onPress={() => handleDateSelect(item)} disabled={!item} style={[styles.dayBox, isToday && styles.todayBox]}>
        <Text style={styles.dayText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  /* DATE STUFF */
  const handleDateSelect = (day) => {
    fullDate = new Date(selectedMonth.getFullYear, selectedMonth.getMonth(), day);
    setSelectedDate(fullDate);
    navigation.navigate('To Do', { selectedDate: fullDate });
  }

  const getMonthsRange = (start, end) => {
    const months = [];
    const current = new Date(start);

    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  };

  const monthsRange = getMonthsRange(startDate, endDate);

  const renderMonth = ({ item }) => {
    const monthName = item.toLocaleString('default', { month: 'long' });
    const year = item.getFullYear();
    const calendarData = generateCalendarData(item.getMonth(), item.getFullYear());

    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.headerText}>{`${monthName} ${year}`}</Text>
        <View style={styles.daysOfWeek}>
          {daysOfWeek.map((day, index) => (
            <Text key={index} style={styles.dayOfWeekText}>
              {day}
            </Text>
          ))}
        </View>
        <FlatList
          data={calendarData}
          renderItem={renderDay}
          keyExtractor={(item, index) => index.toString()}
          numColumns={7}
          scrollEnabled={false}
          contentContainerStyle={styles.calendar}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={monthsRange}
        renderItem={renderMonth}
        keyExtractor={(item) => item.toString()}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={monthsRange.findIndex(
          (month) =>
            month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear()
        )}
        getItemLayout={(data, index) => ({
          length: Dimensions.get('window').width,
          offset: Dimensions.get('window').width * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / Dimensions.get('window').width
          );
          setSelectedMonth(monthsRange[index]);
        }}
      />
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  calendarContainer: {
    width: Dimensions.get('window').width,
    paddingTop: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    width: '100%',
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  calendar: {
    paddingHorizontal: 0,
  },
  dayBox: {
    width: Dimensions.get('window').width / 7 - 10,
    height: Dimensions.get('window').width / 7 - 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  todayBox: {
    backgroundColor: '#cce5ff',
    borderColor: '#007bff',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CalendarScreen;
