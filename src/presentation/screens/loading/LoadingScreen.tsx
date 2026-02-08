import { ActivityIndicator, Text, View } from 'react-native'
import { PermissionsChecker } from '../../providers/PermissionsChecker'

export const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
    
      <PermissionsChecker />

      <ActivityIndicator size={25} color='black' />
      <Text> Loading... </Text>

    </View>
  )
}