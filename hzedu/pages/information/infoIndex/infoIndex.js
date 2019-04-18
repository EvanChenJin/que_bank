//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    isActive: true,
    // swiper配置
    swiperConfig: {
      indicatorDots: true,
      indicatorColor: "#E5E5E5",
      indicatorActiveColor: "#47B100",
      autoplay: true,
      interval: 3000,
      duration: 500,
      circular: true
    },
    // swiper数据
    swiperData: [
      {
        pageUrls: "/pages/information/infoDetail/infoDetail",
        imgUrls: "../../../assets/images/img-classPic.png",
      },
      {
        pageUrls: "/pages/information/infoDetail/infoDetail",
        imgUrls: "../../../assets/images/img-classPic.png",
      },
      {
        pageUrls: "/pages/information/infoDetail/infoDetail",
        imgUrls: "../../../assets/images/img-classPic.png",
      }
    ],
    listData: [
      {
        pageUrl: "/pages/information/infoDetail/infoDetail",
        imgUrl: "../../../assets/images/img-classPic.png",
        des: "国网湖北公司2015-2018年招聘解读",
        time: "2018/11/13",
        num: 682
      },
      {
        pageUrl: "/pages/information/infoDetail/infoDetail",
        imgUrl: "../../../assets/images/img-classPic.png",
        des: "国网湖北公司2015-2018年招聘解读国网湖北公司2015-2018年招聘解读",
        time: "2018/11/16",
        num: 68200
      },
      {
        pageUrl: "/pages/information/infoDetail/infoDetail",
        imgUrl: "../../../assets/images/img-classPic.png",
        des: "国网湖北公司2015-2018年招聘解读",
        time: "2018/11/20",
        num: 6820
      }
    ]
  },
  onLoad: function () {
      
  }
})
