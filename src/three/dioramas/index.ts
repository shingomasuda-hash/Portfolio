import type { ComponentType } from "react";
import type { DioramaProps } from "./shared";
import { FoodBrandDiorama } from "./FoodBrand";
import { RestaurantDiorama } from "./Restaurant";
import { RecruitDiorama } from "./Recruit";
import { EngineeringDiorama } from "./Engineering";
import { LocalDiorama } from "./Local";
import { DigitalDiorama } from "./Digital";
import { SocialDiorama } from "./Social";
import { BrandingDiorama } from "./Branding";
import { AIDiorama } from "./AI";
import { BusinessDiorama } from "./Business";

export const DIORAMAS: Record<string, ComponentType<DioramaProps>> = {
  "food-brand-launch": FoodBrandDiorama,
  "restaurant-experience": RestaurantDiorama,
  "manufacturing-recruit": RecruitDiorama,
  "engineering-recruit": EngineeringDiorama,
  "local-creation": LocalDiorama,
  "digital-experience": DigitalDiorama,
  "social-advertising": SocialDiorama,
  "brand-identity": BrandingDiorama,
  "ai-automation": AIDiorama,
  "business-design": BusinessDiorama,
};
