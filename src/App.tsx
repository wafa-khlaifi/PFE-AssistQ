import { SafeAreaProvider } from 'react-native-safe-area-context';  // ← Ajouté
import 'react-native-gesture-handler';
import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {LogBox} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './view/LoginScreen';
import WorkOrdersScreen from './view/WorkOrdersScreen';
import AddWorkOrderScreen from './view/AddWorkOrderScreen';
import WorkorderSubScreen from './view/WorkorderSubScreen';
import WorkLogDetailsScreen from './view/WorkLogDetailsScreen';
import AttachmentsScreen from './view/AttachmentsScreen';
import WorkOrderMaterialScreen from './view/WorkOrderMaterialScreen';
import WplaborScreen from './view/WplaborScreen';
import WorkactivityScreen from './view/WorkactivityScreen';
import MatusetransScreen from './view/MatusetransScreen';
import LabTransScreen from './view/LabTransScreen';
import AddWoactivityScreen from './view/AddWoactivityScreen';
import AddWorkLogScreen from './view/AddWorkLogScreen';
import AddWplaborScreen from './view/AddWplaborScreen';
import AddMaterialScreen from './view/AddMaterialScreen';
import AddLabTransScreen from './view/AddLabTransScreen';
import TechnicianIntelligentScreen from './view/TechnicianIntelligentScreen';
import CorrectiveActionsScreen from './view/CorrectiveActionsScreen';
LogBox.ignoreLogs([
  'Erreur API',
  'errorboundry',
  'Text strings must be rendered within a <Text> component',         // nouveau filtre

]);
const Stack = createStackNavigator();

const App = () => {
  return(
  <ErrorBoundary>
  <SafeAreaProvider>   
  <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen}   options={{ headerShown: false }}  />
        <Stack.Screen name="WorkOrders" component={WorkOrdersScreen}   options={{ headerShown: false }}  />
        <Stack.Screen name="AddWorkOrder" component={AddWorkOrderScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WorkorderSubScreen"  component={WorkorderSubScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="WorkLogDetailsScreen"  component={WorkLogDetailsScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="AttachmentsScreen"  component={AttachmentsScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="WorkOrderMaterialScreen"  component={WorkOrderMaterialScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="WplaborScreen"  component={WplaborScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="WorkactivityScreen"  component={WorkactivityScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="MatusetransScreen"  component={MatusetransScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="labtransScreen"  component={LabTransScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="AddWoactivityScreen"  component={AddWoactivityScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="AddWorkLogScreen"  component={AddWorkLogScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="AddWplaborScreen"  component={AddWplaborScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="AddMaterialScreen"  component={AddMaterialScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="AddLabTransScreen"  component={AddLabTransScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="TechnicianIntelligentScreen"  component={TechnicianIntelligentScreen}  options={{ headerShown: false  }}/>
        <Stack.Screen name="CorrectiveActionsScreen"  component={CorrectiveActionsScreen}  options={{ headerShown: false  }}/>

      </Stack.Navigator>
    </NavigationContainer>
  </AuthProvider>   </SafeAreaProvider>      </ErrorBoundary>);};



export default App;         



