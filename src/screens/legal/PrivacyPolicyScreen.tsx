import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { GoBack } from '../../components';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      <GoBack onBack={onBack} title="Privacy Policy" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          PRIVACY POLICY
        </Text>


        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          www. dhwaniastro.com (“we”, “Dhwani Astro LLP)”, “Dhwani Astro” (web and
          application) hereinafter referred to as “website”) is a website committed
          to the privacy of its users and visitors’ users of the web application
          (whether or not it is registered). Dhwani Astro Services offers astrology
          services through its astrologers and buys services customized according
          to the needs of the customer. Therefore, kindly take a few moments to go
          through this privacy policy that outlines how the website is going to use
          the information that you give out to the Website.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          The provisions of this policy are as per the provisions contained in the
          Information Technology (Intermediaries Guidelines) Rules 2011 and
          Information Technology (Reasonable Security Practices and Procedures and
          Sensitive Personal Data or Information) Rules 2011 which mandates the act
          of the Company as to the collection, retention, use, and sharing of
          sensitive personal data or information of its users.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          USER’S CONSENT
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          This Privacy Policy, which may be modified/updated sometimes as well,
          covers the particulars, name, and birth details provided by its users for
          identification and contact purposes, and any prediction made based on
          details provided by the users and its further use in the overall context
          of the Website. You agree that by accessing the website and engaging
          ourselves in its content, we indicate ourselves to the policy stated
          herein as our privacy policy. If you do not accept the terms of this
          privacy policy then it is your responsibility not to use this website.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Further navigation on this website shall indicate that you have read and
          agreed to the terms of this privacy policy about the collection, storage,
          management, processing, and disclosure of your data and other particulars
          in terms of the said policy.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          They should be read in conjunction with the relevant terms and conditions
          set out on the Website which include the relevant Terms of Use.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          Collection of Personal Information
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Becoming a Dhwani Astro member requires a user to provide some specific
          details in the signup process. The field can only be made compulsory
          requires you to provide your phone number for OTP (One-Time Password)
          verification is important to check the authenticity of the registration
          process. However, to make it easier for you, you will need to fill in
          your first name, last name, and date of birth (DOB). The date of birth,
          in turn, can be classified as additional or optional information, which
          implies the absence of the corresponding strict requirement to fill in
          this field at the time of registration.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          PURPOSE AND USE OF DATA/INFORMATION COLLECTION
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Thus, Dhwani Astro’s objectives incorporate the desire to provide its
          users with relevant information based on the created profiles that
          reflect one’s preferences and needs. Nevertheless, maybe you want to
          refrain from giving your date of birth but don’t worry because you will
          not be restricted from accessing the services provided by Dhwani Astro
          as long as your phone number is verified.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          Data Deletion
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Delete Profile: If you feel that you want to erase your entire Dhwani
          Astro profile including the personal information linked to the same then
          you will come across a button saying “Delete your account”. The setting
          options are located on the side menu if you have logged into your
          account and you can follow the set procedures aimed at account deletion.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          Voice Recording and Microphone Permission
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          In our app, there is an extraordinary opportunity for you to send
          messages as voice messages in the chat that is following you if you want
          to ask a question or just want to talk. For your queries, it is also
          possible to just speak, voice your queries, or record your voice through
          the device microphone and send them through the chat. This can be viewed
          as one of the opportunities to use the audio interaction feature to make
          the use of our application more natural.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          To be able to help you record your questions and ideas as audio, we were
          to ask for access to your device’s microphone. By granting this
          permission, you enable our application to record your voice as audio and
          then turn the audio into the data which we shall make use of.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          COMMITMENT
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          The Website aims to shield the informational identity of all sorts of
          individuals, who may be accessing their account or information on the
          Website, whether as a member or a customer simply browsing through the
          site. Every user is advised to know the kind of personally identifiable
          information obtained before proceeding to use the app. The Website uses
          the personally identifiable information for certain predictions only but
          it will be ensured that no direct or indirect use of such information
          which is revealed in the prediction for a member will be done other than
          explaining the horoscope charts and predicting to the concerned member
          disclosing such information. Which is further explains that the Website
          in no way is involved in the sale or hiring of the information provided
          to the Website.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          The Website does not undertake to provide help or treatment to users who
          have a mild form of mental disorder which means any person who has in
          his/her mind a thought of suicide, self-destruction; or any kind of harm
          to oneself or others, etc., kindly do not continue using this present
          website as your continued use of the website is strictly at your own
          risk and the Website will not take any responsibility in the event of
          any unfortunate occurrence in your case Such type of user can come in the
          knowledge of the fact that the Website can share the information he/she
          provided it with the law enforcement authorities in case needed. Any
          personal information that is provided by the user while visiting the
          Website, is also not guarded against any form of non-disclosure or even
          confidentiality agreements that may be in place with the Website or any
          third party involved in the scenario.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          That entails that the Website bears no responsibility in any way for the
          accuracy of the predictions made by each astrologer to each user. The
          Website hereby disclaims/excepts all warranties, responsibilities, and
          liabilities arising from the reliability or authenticity of the gems and
          any other associated merchandise depicted and availed through the
          Website. This Website further declares that no warranty on such service
          shall be affixed to it in any manner whatsoever.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          INFORMATION COLLECTED BY THE WEBSITE
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.subSectionTitle}>
          PERSONAL IDENTIFIABLE INFORMATION
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Specifically, information can be considered personal if, through the
          specifics of the data collected, you can pinpoint a given end user. This
          information is collected by the website during the following actions:
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          weight="semibold"
          style={styles.paragraph}>
          Creating an account / Registration data: It is important to note that
          the User of the Website may be required to open an account with the
          Website whenever he or she is accessing the Website. The details that
          would be required for the creation of the account must include Full
          name, Address, Telephone Number, Address, Date of Birth, Gender,
          Location, Photograph, and any other ‘sensitive personal data or
          information’ as explained by the Information Technology (Reasonable
          Security Practices and Procedures and Sensitive Personal Data of
          Information) Rules, 2011 under the Information Technology Act, 2000.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          About and for the protection of the User profile and effectively
          implement the personalized E-mail and SMS Services offered to the User
          through the Website, the User is hereby informed that the e-mail address
          or the phone number provided with the password/OTP will be collected.
          Nevertheless, if the User fails to register at the Website, it might not
          be possible to supply any kinds of services due to the absence of
          personal data of the User.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          weight="semibold"
          style={styles.paragraph}>
          Booking a paid service: If the User opts to order a service through the
          Order Form, the information required will be the following and not
          limited to that shown in Column 1(a), information relating to the User’s
          financial status such as account details, credit card or debit card
          details or other modes of payment through a third-party gateway, IP
          address and other details which a User decides to provide when booking
          for a paid service on the Website. Information of this kind is strictly
          kept under lock and key.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          weight="semibold"
          style={styles.paragraph}>
          Log Files, IP Address, and Cookies: The material that is collected is
          placed by your browser on your computer’s hard drive for example
          cookies. It automatically logs generic information about the user’s
          computer connection to the Internet i.e. Session Data. The website may
          also use temporary or permanent ‘cookies’ that are stored on the user’s
          computer. Cookies would make it possible for the web server instant to
          recognize the user's computer each time the user gets back to the
          specific website, including the time and date of its visit, the web
          page, duration, permanent register or identity number, user registration
          or password, and similar others. These are cookies that are read just by
          the server placed and the user may opt to reject such cookies on his
          computer. It should also be recalled that sometimes the cookies may be
          disabled which may lead to a situation where the user is restricted from
          accessing several aspects of the website. Firstly, the website collects
          the cookie information to give a unique experience to the user on the
          website and also some advertisements are displayed according to the
          user's choice.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Third, some of the services available on the Website may lead the User
          to the website(s) of third parties. The User information provided on
          such platforms may be used by them in the manner laid down in the
          privacy policy adopted by such third-party platforms. Accordingly, the
          Website in such similar regards /related matters does not accept any
          liability(is) or claim(s) that may arise with the help of/use of/misuse
          of such information being given/shared by the User, to third
          party/person/organization not affiliated /associated with the Website.
          It fully disclaims any responsibility for the improper use that may be
          given to the information communicated by the User or by a third party.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          This also includes but is not limited to feedback from the User which
          can be stated/commented on, etc. which may be referenced/disclosed/informed
          on an article/blog or groups/forums or other pages that the User may
          interact with by the time the User is visiting the Website. In
          particular, the provisions of such information which is freely available
          and can be easily accessed by all the Users and visitors of the Website,
          the User is recommended to use its discretion while disclosing it since
          this information is vulnerable to be misused.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          weight="semibold"
          style={styles.paragraph}>
          Miscellaneous Activities: The Website may also get any other
          information, which may be compulsory to state and further it may request
          or capture any other information through email or any other method
          including contract about particular services, which the Website is
          offering or any product which is being purchased through the Website,
          such information may not be saved in the User-Member’s Profile but the
          same may be utilized only for addressing the concern or specific
          requirement of the User.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.subSectionTitle}>
          NON - PERSONAL IDENTIFIABLE INFORMATION
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Non-personal information is information collected where the gathered
          information does not identify the customer as an end user. Such
          information is collected when the user visits the Website, cookies,
          etc., and would include but not limited to the following:
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          1. The previous URL of the site being accessed by the User before he
          /she logged into this site or the next URL www site being accessed by
          the User after he/she logged into this site.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          2. The internet service provider / IP Address / Telecom service
          provider.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          3. This includes the type of Browser used in accessing the website.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          4. Geographical Location
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Non-personal Identifiable Information: These details are also collected
          by the Website for the following purposes, among others: diagnosing
          service/ connection issues, managing the Website, understanding
          patterns, collecting details about users, frequency of visitors to the
          Website, average visitors’ time, pages visited during each session,
          compliance with the current legislation, and assistance with the police
          work, etc.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Such data is used for a better understanding of the site content and
          performance and the website may disclose this information to Third Party
          Service Providers and Third-Party Advertisers to monitor the gross
          efficacy of the website’s internet advertising, content, programming,
          etc., and for any other genuine reasons required.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Thus, acknowledging and confirming that the information given to the
          Website is accurate, recent, and valid, the USER hereby undertakes and
          accepts that the information provided to the Website is true, accurate,
          up-to-date, and real. USER-GENERATED INFORMATION FLOW AFTER THAT NONE
          OF THE WEBSITE AND ITS ENTITES SHALL BE HELD RESPONSIBLE FOR THE
          ACCURACY OF THE INFORMATION THAT THE USER MAY INPUT. The user shall be
          fully responsible and hold responsibility for violation of any of the
          Clause and shall compensate the Website for any loss suffered.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          SECURITY MEASURES
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          weight="semibold"
          style={styles.paragraph}>
          It respects the privacy of the User’s data and thereby uses various
          measures to protect it; these are some measures that any Website and
          this website will take to ensure that unauthorized individuals cannot
          gain access to the information: A user’s details accommodated on a site
          are collected at a secured server. All the payment information for the
          transaction is provided on the Payment Gateway’s or Bank’s SSL page.
          The information is transferred between the Bank’s page and the payment
          gateways used in an encrypted manner. However, please bear in mind that
          the transmission of information is not immune to hacking or other
          misdeeds. Therefore, the user is warned to exercise care and avoid
          sharing the details or particulars that he or she enters on the site
          such as the login details as provided after creating an account.
          Specifically, it means that the website is not liable for the
          protection of the communications that the user might transmit through
          the Internet by email or other means.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          USAGE OF THE INFORMATION
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          weight="semibold"
          style={styles.paragraph}>
          The purpose for which the information collected through the Website can
          be used includes any use which may lawful at the time of the law and
          without prejudice, the following uses shall be allowed: -
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          1. To make browsing a more personal affair for users and to allow users
          to interact with the system in a more personal manner. Nevertheless,
          following the outcome of this Clause “Personal Identifiable
          Information” may be used to investigate and for marketing and
          promotional purposes, to assess the Website usage, enhance the content
          on the Website and the offered product range, and to adapt the
          construction of the Website to the needs of the User.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          2. Also, the details of the IP tracking and Cookies data collected will
          only be used to help the User use the website easily and make it as
          convenient as possible for the User. Any details that are found to be
          sensitive will not be shared with any third parties without the prior
          consent of the User.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          3. All information (and copies thereof) collected by Website for,
          concerning, or relating to users of the Site or their use of the
          services including but not limited to Personal Information, User Data,
          or any information of any kind and nature connected or associated with
          this Site or services offered by Website may be retained by Website for
          such period as is required and including but not limited to the
          following purposes: Legal, tax, evidence, implementing, administering
          or managing the access
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          4. To ensure a seamless experience at the Website for you and to ensure
          your maximum benefit and comfort, the Website may use the data collected
          through cookies, log files, device identifiers, location data and clear
          gif information to: They are: (a) to enable one to avoid typing
          information more than once during the aggregate visit or on subsequent
          visits to the site; (b) personalization to provide relevant content and
          information including advertisement; (c) to facilitate and monitor the
          delivery of value-added services offered by the Website; (d) to provide
          usage and pattern data such as number of visitors, traffic, usage and
          demographics relating to the Website and its services.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          5. Collection of information and data from third-party analytical apps
          concerning traffic and Service usage. This information is collected by
          these tools, which do not contain personal or sensitive data that the
          User sends to the device, including the visited web pages, add-ons, and
          other data that will help the Website in the development of the
          Services. This information is collected from Users in the form of
          anonymized logs and cannot be used practically to identify a single
          User.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          6. In addition, we do not disclose any mobile information to third
          parties/affiliates for use in marketing/promotional purposes. Who is
          sending the text message, individual permission to participate; this
          information will also not be used to forward for selling or giving out
          to a third party.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          CONFIDENTIAL
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          weight="semibold"
          style={styles.paragraph}>
          The website wants to effectively manage all the information given to it
          by its Users, this information may be considered confidential. Thus,
          any information that is not provided to the website and that falls
          under the definition of Personal Information in the relevant
          legislation, shall not be collected/used. The confidential information
          of the User shall not be disclosed or shared by the Websites:
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          1. If the Website feels that there is a strong/ substantial/ potential
          danger or possibility of danger/wrongdoing to the User’s health,
          safety, or life or the health, safety, or life of any other individual
          or the public.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          2. Should such confidential information need to be disclosed to third
          parties under the law and within the legal framework, the following
          should apply inclusive ‘Investigations’, ‘Court summons’, ‘Judicial
          proceedings’, and the like.
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.listItem}>
          3. To exercise legal rights about the protection of and/or recovery of
          the rights and property of the Website.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          CHILDREN PRIVACY POLICY
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Our website believes using and visiting the services are above 18 years
          of age for the users, though some services have information that is not
          restricted for children under 18 years of age. However, it is put
          forward that the website is not designed and developed to attract
          children below the age of 13, and in any case, the use of personally
          identifiable information of individuals below the age of 13 is not
          permitted knowingly. NOTICE TO USERS [Under 13 years of age Users] If
          you are below 13 years old, do not use in any way or at any time, any
          of the services provided on this website. If it is the information of
          the Website to the concerned parent regarding the sharing of any
          information of the child under the age of thirteen, then the Website
          should be contacted. We will also ensure the implementation of measures
          and the removal of such data from the systems of the Website.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          Safety and Security
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          dhwaniastro.com respects users’ secrecy and provides the best mechanism
          to safeguard the user’s profile information, including, but not limited
          to bio information, status, location, etc., and their monetary
          information including credit or debit card details, etc.
          dhwaniastro.com employs the highest standards of the SSL encrypted
          purchases so that you can assure that your transactions from your side
          are safe; therefore, we urge our clients to pay via credit/debit cards
          on dhwaniastro.com with full confidence. In this regard, we aim to
          ensure the protection and safety of our customers making their stay on
          Dhwani Astro completely safe and secure, and people have nothing to
          fear when they buy something online from Dhwani Astro.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          DISCLAIMER
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          THE WEBSITE SHALL NOT BE LIABLE FOR ANY TRANSACTIONS THAT TAKE PLACE
          BETWEEN THE USER AND/OR ANY THIRD-PARTY WEBSITE. The user is required
          to read the terms and conditions, in particular, the privacy policy of
          the third party on their sites, and the usage of such a link on the
          page of this website neither establishes this website as a partner nor
          affiliated with the third party nor will mean that this website is in
          any way responsible for such usage made solely because a link to the
          third-party site was placed on the page of this site.
        </Text>

        <Text
          variant="subtitle"
          color={colors.text.primary}
          weight="semibold"
          style={styles.sectionTitle}>
          FOR GRIEVANCE
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          If you have any queries, you can contact us at:
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Email: support@dhwaniastro.com
        </Text>

        <Text
          variant="body"
          color={colors.text.secondary}
          style={styles.paragraph}>
          Contact No.: 6366526901
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  paragraph: {
    marginBottom: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  subSectionTitle: {
    marginTop: 16,
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 12,
    marginLeft: 16,
    lineHeight: 22,
  },
});

export default PrivacyPolicyScreen;
