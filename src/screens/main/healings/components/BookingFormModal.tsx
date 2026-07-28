
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Text } from '../../../../components/Text';
import { colors } from '../../../../theme';


interface BookingFormModalProps {
    visible: boolean;
    service: any;
    onClose: () => void;
    onSubmit: (payload: any) => void;
}

const BookingFormModal: React.FC<BookingFormModalProps> = ({
    visible,
    service,
    onClose,
    onSubmit,
}) => {
    console.log("servies data", service)


    const [formData, setFormData] = useState({
        serviceId: service?.id,

        name: '',

        email: '',

        phone: '',

        dob: '',

        tob: '',

        pob: '',

        gender: '',

        concern: '',
    });

    useEffect(() => {
        if (service) {
            setFormData(prev => ({
                ...prev,
                serviceId: service.id,
            }));
        }
    }, [service]);

    const updateField = (
        key: string,
        value: string,
    ) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const validateAndSubmit = () => {
        const values = Object.values(formData);

        const hasEmpty = values.some(
            item => !String(item).trim(),
        );

        if (hasEmpty) {
            Alert.alert(
                'Validation',
                'Please fill all fields',
            );
            return;
        }

        onSubmit(formData);
    };

    const renderInput = (
        label: string,
        key: keyof typeof formData,
    ) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                value={formData[key]}
                onChangeText={text =>
                    updateField(key, text)
                }
                style={styles.input}
                placeholder={label}
            />
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.title}>
                            Booking Details
                        </Text>

                        {renderInput('Name', 'name')}
                        {renderInput('Email', 'email')}
                        {renderInput('Phone', 'phone')}
                        {renderInput('DOB', 'dob')}
                        {renderInput('Time Of Birth', 'tob')}
                        {renderInput('Place Of Birth', 'pob')}
                        {renderInput('Gender', 'gender')}
                        {renderInput('Concern', 'concern')}

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={validateAndSubmit}
                        >
                            <Text style={styles.submitText}>
                                Continue
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default BookingFormModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },

    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '90%',
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },

    inputContainer: {
        marginBottom: 14,
    },

    label: {
        marginBottom: 6,
        fontWeight: '600',
    },

    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },

    submitButton: {
        backgroundColor: colors.primary.main,
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 15,
    },

    submitText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },

    closeButton: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },

    closeText: {
        fontWeight: '600',
    },
});