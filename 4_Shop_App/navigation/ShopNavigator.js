import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Button, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { useDispatch } from 'react-redux';
import Colors from '../css/Colors';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import StartupScreen from '../screens/StartupScreen';
import AuthScreen from '../screens/user/AuthScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
    {
        ProductsOverview: ProductsOverviewScreen,
        ProductDetail: ProductDetailsScreen,
        Cart: CartScreen,
    },
    {
        navigationOptions: {
            drawerIcon: (drawerConfig) => (
                <Ionicons
                    name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    size={23}
                    color={drawerConfig.tintColor}
                />
            ),
        },
        defaultNavigationOptions: defaultNavOptions,
    },
);

const OrdersNavigator = createStackNavigator(
    {
        Orders: OrdersScreen,
    },
    {
        navigationOptions: {
            drawerIcon: (drawerConfig) => (
                <Ionicons
                    name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                    size={23}
                    color={drawerConfig.tintColor}
                />
            ),
        },
        defaultNavigationOptions: defaultNavOptions,
    },
);

const AdminNavigator = createStackNavigator(
    {
        UserProducts: UserProductsScreen,
        EditProduct: EditProductScreen,
    },
    {
        navigationOptions: {
            drawerIcon: (drawerConfig) => (
                <Ionicons
                    name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    size={23}
                    color={drawerConfig.tintColor}
                />
            ),
        },
        defaultNavigationOptions: defaultNavOptions,
    },
);

const AuthNavigator = createStackNavigator(
    {
        Auth: AuthScreen,
    },
    {
        defaultNavigationOptions: defaultNavOptions,
    },
);

const ShopNavigator = createDrawerNavigator(
    {
        Products: ProductsNavigator,
        Orders: OrdersNavigator,
        Admin: AdminNavigator,
    },
    {
        contentOptions: {
            activeTintColor: Colors.primary,
        },
        contentComponent: (props) => {
            const dispatch = useDispatch();
            return (
                <View style={styles.drawerButton}>
                    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                        <DrawerNavigatorItems {...props} />
                        <Button
                            title="Logout"
                            color={Colors.primary}
                            onPress={() => {
                                dispatch(authActions.logout());
                                // props.navigation.navigate('Auth');
                            }}
                        />
                    </SafeAreaView>
                </View>
            );
        },
    },
);

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator,
});

const styles = StyleSheet.create({
    drawerButton: {
        flex: 1,
        paddingTop: 20,
    },
});

export default createAppContainer(MainNavigator);
