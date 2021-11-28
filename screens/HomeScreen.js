import { useNavigation } from '@react-navigation/native'
import { auth } from '../firebase'
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView, RefreshControl,TouchableOpacity } from 'react-native';
import ListItem from '../components/ListItem';
import Chart from '../components/Chart';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { getMarketData } from '../services/cryptoService';

const HomeScreen = () => {
  const navigation = useNavigation()

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  //
  const ListHeader = () => (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.largeTitle}>Markets</Text>
      </View>
     
      <View style={styles.containerLogout}>
        <TouchableOpacity
            onPress={handleSignOut}
            style={styles.button}
        >
            <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
      
    <View style={styles.divider} />
    </>
  )
  const [data, setData] = useState([]);
  const [selectedCoinData, setSelectedCoinData] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      const marketData = await getMarketData();
      setData(marketData);
    }

    fetchMarketData();
  }, [])

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['50%'], []);

  const openModal = (item) => {
    setSelectedCoinData(item);
    bottomSheetModalRef.current?.present();
  }

  const [Refreshing, setRefreshing] = useState(false)
  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      const fetchMarketData = async () => {
        const marketData = await getMarketData();
        setData(marketData);
        setRefreshing(false)
      }
      fetchMarketData();
    }, 1300)//50 calls/minute 1.3secx50 = 65 sec which means user cant go out the bounds.
  }
  //
  return (
    
    <BottomSheetModalProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={Refreshing}
            onRefresh={onRefresh}
          />
        }
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({ item }) => (
          <ListItem
            name={item.name}
            symbol={item.symbol}
            currentPrice={item.current_price}
            priceChangePercentage7d={item.price_change_percentage_7d_in_currency}
            logoUrl={item.image}
            onPress={() => openModal(item)}
          />
        )}
        
        ListHeaderComponent={<ListHeader /> }

      />
    </SafeAreaView>

    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      style={styles.bottomSheet}
    >
      {selectedCoinData ? (
        <Chart
          currentPrice={selectedCoinData.current_price}
          logoUrl={selectedCoinData.image}
          name={selectedCoinData.name}
          symbol={selectedCoinData.symbol}
          priceChangePercentage7d={selectedCoinData.price_change_percentage_7d_in_currency}
          sparkline={selectedCoinData?.sparkline_in_7d.price}
        />
      ) : null}
    </BottomSheetModal>
  </BottomSheetModalProvider>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
   button: {
    backgroundColor: '#0782F9',
    width: '25%',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
      
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerLogout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingLeft:5,
    marginTop:-30,
  },
  titleWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  largeTitle: {
    marginTop:5,
    fontSize: 24,
    fontWeight: "bold",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginHorizontal: 16,
    marginTop: 8,
  },
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
