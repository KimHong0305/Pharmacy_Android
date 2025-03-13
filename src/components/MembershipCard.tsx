import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MembershipCard = ({ point }: { point: number }) => {
  const getRankDetails = (point: number) => {
    if (point > 8000) {
      return { rank: "KIM CƯƠNG", nextRank: null, remaining: 0, bgColor: "#3b82f6" };
    } else if (point > 6000) {
      return { rank: "BẠCH KIM", nextRank: 8000, remaining: (8000 - point) * 1000, bgColor: "#6b7280" };
    } else if (point > 4000) {
      return { rank: "VÀNG", nextRank: 6000, remaining: (6000 - point) * 1000, bgColor: "#facc15" };
    } else if (point > 2000) {
      return { rank: "BẠC", nextRank: 4000, remaining: (4000 - point) * 1000, bgColor: "#d1d5db" };
    } else {
      return { rank: "ĐỒNG", nextRank: 2000, remaining: (2000 - point) * 1000, bgColor: "#9e7c5b" };
    }
  };

  const { rank, nextRank, remaining, bgColor } = getRankDetails(point);
  const progressPercent = nextRank ? ((point / nextRank) * 100).toFixed(1) : "100";

  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <View style={styles.rankContainer}>
          <View style={styles.iconContainer}>
            <Icon name="star" size={20} color="#FFD700" />
          </View>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
        <View style={styles.diamondIcon}>
          <Text style={{ fontSize: 18 }}>💎</Text>
        </View>
      </View>

      {/* Thanh tiến trình */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(Number(progressPercent), 100)}%`, backgroundColor: rank === "VÀNG" ? "#90cef4" : "#FFD700" }]} />
        </View>
        {nextRank && (
          <Text style={styles.remainingText}>
            Chi tiêu thêm <Text style={{ fontWeight: "bold" }}>{remaining.toLocaleString()} ₫</Text> để thăng hạng
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: 370,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rankContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  diamondIcon: {
    width: 30,
    height: 30,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "white",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  remainingText: {
    fontSize: 14,
    color: "white",
    marginTop: 8,
  },
});

export default MembershipCard;
