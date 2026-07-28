// import React from 'react';
// import {
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
// } from 'react-native';
// import { Text } from '../../../components/Text';
// import { colors } from '../../../theme';
// import { API_BASE_URL } from '../../../constants/api.constants';
// import { GoBack } from '../../../components';

// const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;

// interface Service {
//   id: string;
//   name: string;
//   image?: string;
//   description?: string;
//   longText?: string;
//   price: number;
//   category?: {
//     name: string;
//   };
// }

// interface ServiceDetailsScreenProps {
//   service: Service | null;
//   onBack: () => void;
//   onConfirmBooking: () => void;
// }

// const ServiceDetailsScreen: React.FC<ServiceDetailsScreenProps> = ({
//   service,
//   onBack,
//   onConfirmBooking,
// }) => {
//   if (!service) {
//     return null;
//   }

//   console.log("serviceservice", service)

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <GoBack onBack={onBack} />
//         <Image
//           source={{
//             uri: `${BASE_IMAGE_URL}${service.image}`,
//           }}
//           style={styles.heroImage}
//           resizeMode="cover"
//         />

//         <View style={styles.content}>
//           <Text style={styles.title} weight="semibold">
//             {service.name}
//           </Text>

//           <View style={styles.metaRow}>
//             <Text style={styles.category} weight="medium">
//               {service.category?.name}
//             </Text>
//             <Text style={styles.price} weight="semibold">
//               ₹{service.price}
//             </Text>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle} weight="semibold">
//               About Service
//             </Text>
//             <Text style={styles.description}>
//               {service.description}
//             </Text>
//           </View>

//           {service.longText && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle} weight="semibold">
//                 Detailed Information
//               </Text>
//               <Text style={styles.longText}>
//                 {service.longText}
//               </Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={styles.confirmButton}
//           onPress={onConfirmBooking}
//         >
//           <Text style={styles.confirmButtonText} weight="semibold">
//             Confirm Booking
//           </Text>
//         </TouchableOpacity>

//         {/* <TouchableOpacity
//           style={styles.backButton}
//           onPress={onBack}
//         >
//           <Text style={styles.backButtonText} weight="medium">
//             ← Back to Services
//           </Text>
//         </TouchableOpacity> */}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   heroImage: {
//     width: '100%',
//     height: 280,
//   },
//   content: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 100,
//   },
//   title: {
//     fontSize: 24,
//     color: '#1F1F2E',
//   },
//   metaRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 12,
//   },
//   category: {
//     fontSize: 14,
//     color: colors.primary.main,
//   },
//   price: {
//     fontSize: 22,
//     color: '#22A45D',
//   },
//   section: {
//     marginTop: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: '#1F1F2E',
//     marginBottom: 12,
//   },
//   description: {
//     fontSize: 15,
//     color: '#6B6B80',
//     lineHeight: 22,
//   },
//   longText: {
//     fontSize: 15,
//     color: '#444',
//     lineHeight: 22,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#F0F0F0',
//   },
//   confirmButton: {
//     backgroundColor: colors.primary.main,
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   confirmButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   backButton: {
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   backButtonText: {
//     color: colors.primary.main,
//     fontSize: 15,
//   },
// });

// export default ServiceDetailsScreen;


import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '../../../components/Text';
import { colors } from '../../../theme';
import { API_BASE_URL } from '../../../constants/api.constants';
import { GoBack } from '../../../components';

const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;

interface Service {
  id: string;
  name: string;
  image?: string;
  description?: string;
  longText?: string;
  price: number;
  category?: {
    name: string;
  };
}

interface ServiceDetailsScreenProps {
  service: Service | null;
  onBack: () => void;
  onConfirmBooking: () => void;
}

const ServiceDetailsScreen: React.FC<
  ServiceDetailsScreenProps
> = ({
  service,
  onBack,
  onConfirmBooking,
}) => {
    if (!service) {
      return null;
    }

    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
          }}>
          {/* Hero Section */}

          <View style={styles.heroContainer}>
            <Image
              source={{
                uri: `${BASE_IMAGE_URL}${service.image}`,
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            <LinearGradient
              colors={[
                'transparent',
                'rgba(0,0,0,0.2)',
                'rgba(0,0,0,0.85)',
              ]}
              style={styles.gradient}
            />

            <View style={styles.backButtonWrapper}>
              <GoBack onBack={onBack} />
            </View>

            <View style={styles.heroContent}>
              <View style={styles.categoryBadge}>
                <Text
                  style={styles.categoryText}
                  weight="medium">
                  {service.category?.name}
                </Text>
              </View>

              <Text
                style={styles.heroTitle}
                weight="semibold">
                {service.name}
              </Text>

              <Text
                style={styles.heroPrice}
                weight="semibold">
                ₹{service.price}
              </Text>
            </View>
          </View>

          {/* Content */}

          <View style={styles.content}>
            {/* Overview Card */}

            <View style={styles.card}>
              <Text
                style={styles.cardTitle}
                weight="semibold">
                About Service
              </Text>

              <Text style={styles.description}>
                {service.description ||
                  'No description available'}
              </Text>
            </View>

            {/* Detailed Information */}

            {!!service.longText && (
              <View style={styles.card}>
                <Text
                  style={styles.cardTitle}
                  weight="semibold">
                  Detailed Information
                </Text>

                <Text style={styles.longText}>
                  {service.longText}
                </Text>
              </View>
            )}

            {/* Highlights */}

            <View style={styles.card}>
              <Text
                style={styles.cardTitle}
                weight="semibold">
                Service Highlights
              </Text>

              <View style={styles.highlightItem}>
                <Text style={styles.highlightText}>
                  <Text style={{ color: colors.primary.main }}>✓</Text> Personalized Guidance
                </Text>
              </View>

              <View style={styles.highlightItem}>
                <Text style={styles.highlightText}>
                  <Text style={{ color: colors.primary.main }}>✓</Text>  Trusted Service
                </Text>
              </View>

              <View style={styles.highlightItem}>
                <Text style={styles.highlightText}>
                  <Text style={{ color: colors.primary.main }}>✓</Text>  Expert Consultation
                </Text>
              </View>

              <View style={styles.highlightItem}>
                <Text style={styles.highlightText}>
                  <Text style={{ color: colors.primary.main }}>✓</Text>  Confidential Process
                </Text>
              </View>
            </View>

            {/* Pricing Card */}

            <View style={styles.priceCard}>
              <Text
                style={styles.priceLabel}
                weight="medium">
                Service Price
              </Text>

              <Text
                style={styles.priceValue}
                weight="semibold"
              >
                ₹{service.price}
              </Text>

              <Text style={styles.priceNote}>
                One-time service booking fee
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Footer */}

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>
              Total Price
            </Text>

            <Text
              style={styles.footerPrice}
              weight="semibold">
              ₹{service.price}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirmBooking}>
            <Text
              style={styles.confirmButtonText}
              weight="semibold">
              Confirm Booking
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

export default ServiceDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  heroContainer: {
    height: 340,
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  backButtonWrapper: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  heroContent: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },

  categoryText: {
    color: '#FFF',
    fontSize: 13,
  },

  heroTitle: {
    fontSize: 22,
    color: '#FFF',
    marginBottom: 8,
  },

  heroPrice: {
    fontSize: 20,
    color: '#FFF',
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    color: '#1F1F2E',
    marginBottom: 14,
  },

  description: {
    fontSize: 15,
    // lineHeight: 24,
    color: '#666',
  },

  longText: {
    fontSize: 15,
    // lineHeight: 24,
    color: '#555',
  },

  highlightItem: {
    paddingVertical: 8,
  },

  highlightText: {
    fontSize: 15,
    color: '#444',
  },

  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },

  priceLabel: {
    color: '#777',
    fontSize: 14,
  },

  priceValue: {
    fontSize: 22,
    color: '#22A45D',
    marginTop: 10,
  },

  priceNote: {
    marginTop: 8,
    color: '#888',
    fontSize: 13,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: '#FFF',

    paddingHorizontal: 20,
    paddingVertical: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderTopWidth: 1,
    borderTopColor: '#EEE',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: -4,
    },

    elevation: 10,
  },

  footerLabel: {
    color: '#777',
    fontSize: 13,
  },

  footerPrice: {
    color: '#22A45D',
    fontSize: 24,
  },

  confirmButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
  },

  confirmButtonText: {
    color: '#FFF',
    fontSize: 15,
  },
});

