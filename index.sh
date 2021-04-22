#!/bin.sh 
cd /CouponOneIndia/
sh index.sh
echo "OneIndia Done !"
cd /CouponsDuniya/
sh index.sh
echo "Coupon Duniya Done !"
cd /GrabOn/
sh index.sh
echo "GrabOn Done !"
python merger.py
echo "File Merged Successfully"