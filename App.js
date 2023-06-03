import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './screens/Login';
import Adicionar from './screens/Adicionar';
import Saldo from './screens/Saldo';
import Inicial from './screens/Inicial';
import Baixar from './screens/Baixar';
import Delete from './screens/Delete';
import Formulario from './screens/Formulario';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Adicionar' component={Adicionar} />
        <Stack.Screen name='Saldo' component={Saldo} />
        <Stack.Screen name='Inicial' component={Inicial} />
        <Stack.Screen name='Baixar' component={Baixar} />
        <Stack.Screen name='Delete' component={Delete} />
        <Stack.Screen name='Formulario' component={Formulario} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}