import { useNavigation } from '@react-navigation/native'
import { auth } from '../firebase'
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView, RefreshControl,TouchableOpacity, Image } from 'react-native';
import ListItem from '../components/ListItem';
import Chart from '../components/Chart';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { getMarketData } from '../services/cryptoService';

const HomeScreen = () => {
  const navigation = useNavigation()

  const handleSignOut = () => {//Çıkış yap butonuna tıklandığında çalışır.
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")//Kullanıcıyı Login sayfasına yani giriş ve kayıt işlemlerinin yapıldığı sayfaya yönlendirir.
      })
      .catch(error => alert(error.message)) //Herhangi bir hata ile karşılaşıldığında kullanıcı bilgilendirilir.
  }

  const ListHeader = () => (
    <>
      
      <View style={styles.titleWrapper}>
        <Image source={require('../assets/logo.png')} style={styles.image}/>
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
    const fetchMarketData = async () => { // web api üzerinden tüm kripto paraların anlık durumunu çekiyoruz.
      const marketData = await getMarketData();
      setData(marketData);//yeni çekilen verileri, data değişkenine atıyorum.
    }

    fetchMarketData();
  }, [])

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['50%'], []);

  const openModal = (item) => {
    setSelectedCoinData(item);
    bottomSheetModalRef.current?.present();
  }

  const [Refreshing, setRefreshing] = useState(false)//Ekranı en yukarı kaydırıldığında sayfa yenilenir. Yenilenirken web api üzerinden anlık kripto para verileri çekilir.
  const onRefresh = () => {
    setRefreshing(true)//yenileme çubuğunun görünümünü aç.
    setTimeout(() => {
      const fetchMarketData = async () => {// web api üzerinden tüm kripto paraların anlık durumunu çekiyoruz.
        const marketData = await getMarketData();
        setData(marketData);//yeni çekilen verileri, data değişkenine atıyorum.
        setRefreshing(false)//yenileme çubuğunun görünümünü kapat.
      }
      fetchMarketData();
    }, 1300)//50 calls/minute 1.3secx50 = 65 sec. Kullanıcıyı 1.3 saniye bekletip dakikada 50 istek sınırının aşılmaması sağlandı.
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
            tintColor="red"
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
    backgroundColor: 'red',
    width: '25%',
    padding: 5,
    borderRadius: 0,
    alignItems: 'center',
      
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#181818',
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
    marginTop: 25,
    paddingHorizontal: 16,
    flexDirection: 'row'
  },
  largeTitle: {
    marginTop:5,
    fontSize: 24,
    fontWeight: "bold",
    color: 'white'
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 8,
  },
  bottomSheet: {
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image:{
    width:25,
    height:25,
    marginTop:8,
    marginRight: 10
  }
})
