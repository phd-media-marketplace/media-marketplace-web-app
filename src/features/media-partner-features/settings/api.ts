import { apiClient } from "@/services/https";
import type {
    UserProfile,
    MediaPartnerCompanyProfile,
    TeamMember,
} from "./types";


export const getMediaPartner = async (mediaPartnerId: string) => {
    try {
  const response = await apiClient.get(`/media-partners/${mediaPartnerId}`);
  return response.data;
} catch (error) {
  console.error("Error fetching media partner:", error);
  throw error;
}
};

export const updateMediaPartnerDetails = async (mediaPartnerId: string, details: Partial<MediaPartnerCompanyProfile>) => {
  try {
    const response = await apiClient.put(`/media-partners/${mediaPartnerId}`, details);
    return response.data;
  } catch (error) {
    console.error("Error updating media partner details:", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const response = await apiClient.get(`/user/profile/${userId}`);
    return response.data as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    const response = await apiClient.put(`/user/profile/${userId}`, profileData);
    return response.data as UserProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export const getTeamMembers = async (mediaPartnerId: string) => {
  try {
    const response = await apiClient.get(`/media-partners/${mediaPartnerId}/team-members`);
    return response.data as TeamMember[];
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
}

export const addTeamMember = async (mediaPartnerId: string, email: string) => {
  try {
    const response = await apiClient.post(`/media-partners/${mediaPartnerId}/team-members`, { email });
    return response.data as TeamMember;
  } catch (error) {
    console.error("Error adding team member:", error);
    throw error;
  }
}