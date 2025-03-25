<template>
  <div class="order-page">
    <div class="order-list">
      <div v-for="item in orderList" :key="item.id" class="order-item">
        <div class="item-image">
          <img :src="item.image" :alt="item.name">
        </div>
        <div class="item-info">
          <h3 class="item-name">{{ item.name }}</h3>
          <p class="item-desc">{{ item.description }}</p>
          <div class="item-price">
            <span class="price">¥{{ item.price }}</span>
            <span class="count">x{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order-summary">
      <div class="total-price">
        <span>总计：</span>
        <span class="price">¥{{ totalPrice }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'


export default Vue.extend({
  name: 'Order',
  data() {
    return {
      orderList: [
        {
          id: 1,
          name: '商品1',
          description: '这是商品1的描述信息',
          price: 99.00,
          count: 1,
          image: 'https://picsum.photos/200/200?random=1'
        },
        {
          id: 2,
          name: '商品2',
          description: '这是商品2的描述信息',
          price: 199.00,
          count: 2,
          image: 'https://picsum.photos/200/200?random=2'
        }
      ]
    }
  },
  computed: {
    totalPrice(): number {
      return this.orderList.reduce((total, item) => total + (item.price * item.count), 0)
    }
  },
  created() {
    console.log('order wxload 1111111111')
    // 小程序页面生命周期
    window.addEventListener('wxload', (query: any) => console.log('order wxload', query))
    window.addEventListener('wxshow', () => console.log('order wxshow'))
    window.addEventListener('wxready', () => console.log('order wxready'))
    window.addEventListener('wxhide', () => console.log('order wxhide'))
    window.addEventListener('wxunload', () => console.log('order wxunload'))

    if (process.env.isMiniprogram) {
      console.log('Running in miniprogram')
    } else {
      console.log('Running in Web')
    }
  }
})
</script>

<style lang="less">
.order-page {
  padding: 20px;
  background: #f5f5f5;
}

.order-list {
  margin-top: 20px;
}

.order-item {
  display: flex;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;

  .item-image {
    width: 100px;
    height: 100px;
    margin-right: 15px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .item-name {
      font-size: 16px;
      font-weight: bold;
      margin: 0;
      color: #333;
    }

    .item-desc {
      font-size: 14px;
      color: #666;
      margin: 5px 0;
    }

    .item-price {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price {
        color: #ff6b81;
        font-size: 18px;
        font-weight: bold;
      }

      .count {
        color: #666;
        font-size: 14px;
      }
    }
  }
}

.order-summary {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;

  .total-price {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 16px;

    .price {
      color: #ff6b81;
      font-size: 20px;
      font-weight: bold;
      margin-left: 10px;
    }
  }
}

@media screen and (max-width: 480px) {
  .order-item {
    .item-image {
      width: 80px;
      height: 80px;
    }

    .item-info {
      .item-name {
        font-size: 14px;
      }

      .item-desc {
        font-size: 12px;
      }

      .item-price {
        .price {
          font-size: 16px;
        }

        .count {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
