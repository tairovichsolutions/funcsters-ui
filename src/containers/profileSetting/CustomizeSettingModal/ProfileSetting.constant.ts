import { Assets } from "@/constants/assets";

export const Tabs = {
  PersonalInformation: "PersonalInformation",
  AccountStatus: "AccountStatus",
  ChangePassword: "ChangePassword",
};

export const TabsItems = [
  {
    id: 1,
    label: "Personal Information",
    svgImage: Assets.Svgs.ProfileSetting,
    value: Tabs.PersonalInformation,
  },
  {
    id: 2,
    label: "Account Status",
    svgImage: Assets.Svgs.AccountSetting,
    value: Tabs.AccountStatus,
  },
  {
    id: 3,
    label: "Change Password",
    svgImage: Assets.Svgs.PasswordSetting,
    value: Tabs.ChangePassword,
  },
];
