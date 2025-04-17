import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { HOMEPAGE_CONTENT_MODULE } from "src/modules/homepage"
import { NAVBAR_CONTENT_MODULE } from "src/modules/navbar"
import { HOMEPAGE_SLIDER_CONTENT_MODULE } from "src/modules/homepage-slider"
import HomepageService from '../../../modules/homepage/service'
import NavBarService from '../../../modules/navbar/service'
import HomepageSliderContentService from '../../../modules/homepage-slider/service'

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const homepageModuleService = req.scope.resolve<HomepageService>(HOMEPAGE_CONTENT_MODULE)
  const navbarService = req.scope.resolve<NavBarService>(NAVBAR_CONTENT_MODULE)
  const sliderService = req.scope.resolve<HomepageSliderContentService>(HOMEPAGE_SLIDER_CONTENT_MODULE)

  const [homepageContent, navbarContent, sliderContent] = await Promise.all([
    homepageModuleService.listHomepageContents(),
    navbarService.listNavBarContents(),
    sliderService.listHomepageSliderContents()
  ])

  res.status(200).json({
    content: homepageContent[0]?.content || null,
    navbar: navbarContent || [],
    slider: sliderContent || []
  });
}
