import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Input from '../../components/UI/Input';
import Colors from '../../css/Colors';
import * as productsActions from '../../store/actions/products';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    switch (action.type) {
        case FORM_INPUT_UPDATE:
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value,
            };
            const updatedValidities = {
                ...state.inputValidities,
                [action.input]: action.isValid,
            };
            let updatedFormIsValid = true;

            for (const key in updatedValidities) {
                updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
            }

            return {
                formIsValid: updatedFormIsValid,
                inputValidities: updatedValidities,
                inputValues: updatedValues,
            };
        default:
            return state;
    }
};

function EditProductScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const productId = route.params ? route.params.productId : null;
    const editedProduct = useSelector((state) =>
        state.products.userProducts.find((prod) => prod.id === productId),
    );
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: '',
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        },
        formIsValid: editedProduct ? true : false,
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [{ text: 'Ok' }]);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            if (editedProduct) {
                await dispatch(
                    productsActions.updateProduct(
                        productId,
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl,
                    ),
                );
            } else {
                await dispatch(
                    productsActions.createProduct(
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl,
                        +formState.inputValues.price,
                    ),
                );
            }
        } catch (error) {
            setError(error.message);
        }

        setIsLoading(false);
        navigation.goBack();
    }, [dispatch, productId, formState]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title="Save"
                        iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                        onPress={submitHandler}
                    />
                </HeaderButtons>
            ),
        });
    }, [submitHandler]);

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                input: inputIdentifier,
                value: inputValue,
                isValid: inputValidity,
            });
        },
        [dispatchFormState],
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={30}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id="title"
                        label="Title"
                        errorText="Please enter a valid title!"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id="imageUrl"
                        label="Image Url"
                        errorText="Please enter a valid image url!"
                        keyboardType="default"
                        returnKeyType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {editedProduct ? null : (
                        <Input
                            id="price"
                            label="Price"
                            errorText="Please enter a valid price!"
                            keyboardType="decimal-pad"
                            returnKeyType="next"
                            onInputChange={inputChangeHandler}
                            required
                            min={0.1}
                        />
                    )}
                    <Input
                        id="description"
                        label="Description"
                        errorText="Please enter a valid description!"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export const screenOptions = (data) => {
    const routeParams = data.route.params ? data.route.params : {};

    return {
        headerTitle: routeParams.productId ? 'Edit Product' : 'Add Product',
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditProductScreen;
