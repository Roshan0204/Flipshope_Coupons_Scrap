#!/bin.sh 
sh /root/Flipshope_Coupons_Scrap/CouponOneIndia/index.sh
echo "OneIndia Done !"
sh /root/Flipshope_Coupons_Scrap/CouponsDuniya/index.sh
echo "Coupon Duniya Done !"
sh /root/Flipshope_Coupons_Scrap/GrabOn/index.sh
echo "GrabOn Done !"
python merger.py
echo "File Merged Successfully"