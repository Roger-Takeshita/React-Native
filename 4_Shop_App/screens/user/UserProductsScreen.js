import React from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Colors from '../../css/Colors';
import * as productsActions from '../../store/actions/products';

function UserProductsScreen({ navigation }) {
    const userProducts = useSelector((state) => state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = (id) => {
        navigation.navigate('EditProduct', {
            productId: id,
        });
    };

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => dispatch(productsActions.deleteProduct(id)),
            },
        ]);
    };

    if (userProducts.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Text>No products found, maybe start creating some?</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={userProducts}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
                <ProductItem
                    imageUrl={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => editProductHandler(itemData.item.id)}
                >
                    <Button
                        color={Colors.primary}
                        title="Edit"
                        onPress={() => editProductHandler(itemData.item.id)}
                    />
                    <Button
                        color={Colors.primary}
                        title="Delete"
                        onPress={() => deleteHandler(itemData.item.id)}
                    />
                </ProductItem>
            )}
        />
    );
}

export const screenOptions = (data) => {
    return {
        headerTitle: 'Your Products',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Menu"
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => data.navigation.toggleDrawer()}
                />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Add"
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => data.navigation.navigate('EditProduct')}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default UserProductsScreen;
