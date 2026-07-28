import React from 'react';
import {
    Modal,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { API_BASE_URL } from '../../../../constants/api.constants';
import { Text } from '../../../../components/Text';
import { colors } from '../../../../theme';


const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;

interface ServiceDetailsModalProps {
    visible: boolean;
    service: any;
    onClose: () => void;
    onConfirmBooking: () => void;
}


const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
    visible,
    service,
    onClose,
    onConfirmBooking,
}) => {


   


    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {service && (
                            <>
                                <Image
                                    source={{
                                        uri: `${BASE_IMAGE_URL}${service.image}`,
                                    }}
                                    style={styles.modalImage}
                                />

                                <Text style={styles.modalTitle}>
                                    {service.name}
                                </Text>

                                <Text style={styles.modalCategory}>
                                    {service.category?.name}
                                </Text>

                                <Text style={styles.modalPrice}>
                                    ₹{service.price}
                                </Text>

                                <Text style={styles.modalSectionTitle}>
                                    About Service
                                </Text>

                                <Text style={styles.modalDescription}>
                                    {service.description}
                                </Text>

                                <Text style={styles.modalSectionTitle}>
                                    Detailed Information
                                </Text>

                                <Text style={styles.modalLongText}>
                                    {service.longText}
                                </Text>

                                <TouchableOpacity
                                    style={styles.bookNowButton}
                                    onPress={onConfirmBooking}
                                >
                                    <Text style={styles.bookNowText}>
                                        Confirm Booking
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={onClose}
                                >
                                    <Text style={styles.closeButtonText}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ServiceDetailsModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },

    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        maxHeight: '90%',
        paddingBottom: 30,
    },

    modalImage: {
        width: '100%',
        height: 250,
    },

    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        paddingHorizontal: 20,
        marginTop: 18,
    },

    modalCategory: {
        color: colors.primary.main,
        fontWeight: '600',
        fontSize: 14,
        paddingHorizontal: 20,
        marginTop: 5,
    },

    modalPrice: {
        fontSize: 26,
        fontWeight: '700',
        color: '#22A45D',
        paddingHorizontal: 20,
        marginTop: 10,
    },

    modalSectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 8,
        paddingHorizontal: 20,
    },

    modalDescription: {
        color: '#666',
        lineHeight: 22,
        paddingHorizontal: 20,
    },

    modalLongText: {
        color: '#444',
        lineHeight: 24,
        paddingHorizontal: 20,
    },

    bookNowButton: {
        marginHorizontal: 20,
        marginTop: 30,
        backgroundColor: colors.primary.main,
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: 'center',
    },

    bookNowText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },

    closeButton: {
        marginHorizontal: 20,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },

    closeButtonText: {
        fontWeight: '600',
        color: '#444',
    },
});