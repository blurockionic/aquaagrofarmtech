import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

type Props = {}

const Inventory = (props: Props) => {
  return (
    <View>
      <Text style={styles.text}>Inventory feature coming soon!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20
  },
})
export default Inventory