import styled, { css } from 'styled-components'
import {
  colorMain,
  colorGreyDark,
  colorGrey,
  colorBlack,
  colorWhite,
  colorGreyLight,
} from '@/helpers/styles'

export const PageContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: ${colorBlack};
  overflow: hidden;
`

export const ThreeQuartersContainer = styled.div`
  width: 75vw;
  min-height: 100vh;
`

export const OneQuartersContainer = styled.div`
  width: 25vw;
  min-height: 100vh;
`

export const BannerContainer = styled.div`
  display: flex;
  max-height: 65px;
`

export const BannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 17.5px;
  color: ${colorGrey};
  background: ${colorGreyDark};
`

export const BannerHeaderMap = styled(BannerHeader)`
  width: 50vw;
`

export const BannerHeaderLosses = styled(BannerHeader)``

export const BannerHeaderLatest = styled(BannerHeader)`
  a {
    text-decoration: underline;
  }
`

export const TitlePage = styled.h1`
  color: ${colorMain};
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  letter-spacing: -0.02em;
`

export const SubtitlePage = styled.h2`
  display: flex;
  align-items: center;
  color: ${colorGrey};
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  letter-spacing: -0.02em;
  svg {
    margin-right: 10.5px;
  }
`

export const TextMedium = styled.p`
  display: inline-block;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: -0.02em;
`

export const TextSmall = styled.p`
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  letter-spacing: -0.02em;
`

export const MinInfo = styled(TextSmall)`
  color: ${colorGreyLight};
`

export const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
`

export const TwitterContainer = styled.div`
  position: relative;
  width: 25vw;
  z-index: 2;
`

export const ButtonMore = styled.button`
  position: relative;
  width: 25px;
  height: 25px;
  background: ${colorMain};
  border-radius: 100px;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 10px;
    height: 2px;
    background: ${colorGreyDark};
    transform: translate3D(-50%, -50%, 0);
  }
  &::after {
    width: 2px;
    height: 10px;
  }
`

export const ModalTwitter = styled.div`
  background: ${colorGreyDark};
`

export const Panel = styled.div`
  padding: 40px 30px;
  color: ${colorWhite};
  background: ${colorBlack};
`

export const PanelLosses = styled(Panel)``

export const PanelLatest = styled(Panel)`
  padding: 25px 30px;
`

export const PanelDonation = styled(Panel)`
  display: flex;
  justify-content: center;
  padding: 60px;
`

export const ButtonDonation = styled.button`
  display: none;
  margin: 0 auto;
  padding: 10px 40px;
  color: ${colorBlack};
  background: ${colorMain};
  border-radius: 20px;
`

export const DonationLinksList = styled.ul`
  li {
    &:not(:last-child) {
      margin-bottom: 16.5px;
    }
  }
`

export const DonationLink = styled.a`
  display: flex;
  align-items: center;
  color: ${colorMain};
  svg {
    margin-right: 10.5px;
  }
`
