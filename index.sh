#!/bin.sh 
cd /CouponOneIndia/
sh index.sh
echo "OneIndia Done !"
cd ..
cd /CouponsDuniya/
sh index.sh
echo "Coupon Duniya Done !"
cd ..
cd /GrabOn/
sh index.sh
echo "GrabOn Done !"
cd ..
python merger.py
echo "File Merged Successfully"