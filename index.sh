#!/bin.sh 
sh /CouponOneIndia/index.sh
echo "OneIndia Done !"
sh /CouponsDuniya/index.sh
echo "Coupon Duniya Done !"
sh /GrabOn/index.sh
echo "GrabOn Done !"
python merger.py
echo "File Merged Successfully"