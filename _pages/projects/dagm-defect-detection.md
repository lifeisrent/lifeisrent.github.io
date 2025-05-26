---
title: "DAGM 기반 반도체 결함 검사"
permalink: /projects/dagm-defect-detection
layout: single
toc: true
toc_label: "Table of Contents"
---


# 🧠 프로젝트 소개: 반도체 결함 검출을 위한 딥러닝 모델 실습

이 프로젝트는 **반도체 비전 검사 환경을 모사**한 이미지 데이터셋을 기반으로, 딥러닝 모델을 학습하고 성능을 시각화하는 것을 목표로 합니다.  
최종적으로는 **DAGM 2007 데이터셋을 넘어서는 고난이도 결함 이미지**에도 도전합니다.

---

## 🎯 목표

- DAGM 2007 데이터셋을 활용한 **결함 분류 및 탐지 모델** 학습
- **ResNet, YOLO 등 다양한 모델** 시도 및 성능 비교
- 학습 결과를 **loss curve 시각화**를 통해 분석하고,  
  이를 기반으로 **learning rate 튜닝 등 모델 최적화 수행**
- DAGM보다 **더 어려운 결함 데이터셋으로 확장 도전**

---

## 🗓️ 진행 일정

| 기간 | 내용 |
|------|------|
| **1주차** | 머신비전 개요 및 이미지 전처리 실습 |
| **2~4주차** | DAGM 2007 데이터셋 기반 모델 학습<br>- ResNet, YOLO 등 다양한 모델 실험<br>- 성능 평가 및 loss/accuracy 시각화<br>- 하이퍼파라미터 튜닝 |
| **5주차** | 더 어려운 데이터셋에 도전 (도메인 일반화 테스트) |

---

## 📌 결과 요약

- 학습 곡선(Loss Curve)을 통해 **Learning Rate 최적화**
- 다양한 CNN 기반 구조 실험 및 탐지 정확도 개선
- 실험 결과 및 코드 기록 → [실험 기록 보기](./experiments)

---

## 🔧 사용 기술

- Python, PyTorch
- OpenCV, Albumentations
- Matplotlib, Seaborn (시각화)
- Jupyter Notebook / Google Colab

---

## 📁 데이터셋

- [DAGM 2007 (Defect Class Dataset)](https://conferences.mpi-inf.mpg.de/dagm/2007/prizes.html)
- TBD: 새로운 고난이도 결함 이미지 데이터셋

---

## 👥 Contributors

- smLee , jhj1111, frozenreboot, ausudu 스터디 팀원
