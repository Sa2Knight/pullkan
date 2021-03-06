import { User } from '@/models/user'
import { Label } from '@/models/label'
import { ReviewList } from '@/models/reviewList'
import Repository from './repository'

export class PR {
  constructor(
    public id: string,
    public title: string,
    public url: string,
    public repository: Repository,
    public author: User,
    public lastCommitDate: Date,
    public labels: Label[],
    public requestedReviewers: User[],
    public reviewList: ReviewList
  ) {}

  /**
   * 二種類のPR一覧を渡し、newPRsに新しいrequestedPRが追加されているか判定する
   * 新規PRがある場合はその先頭PRを戻す
   */
  static getNewRequestedPR(oldPRs: PR[], newPRs: PR[]): PR | undefined {
    const oldPRIds = oldPRs.map(pr => pr.id)
    return newPRs.find(newPr => {
      return oldPRIds.indexOf(newPr.id) === -1
    })
  }

  /**
   * WIPラベルが付与されているか
   */
  isWIP() {
    return this.labels.some(label => label.name === 'WIP')
  }

  /**
   * 指定したユーザがPRの所有者であるか
   */
  isOwnedBy(user: User) {
    return this.author.id === user.id
  }

  approvers() {
    const approvers = new Set<User>()

    this.reviewList.reviews.forEach(review => {
      if (review.state === 'APPROVED') {
        approvers.add(review.user)
      } else if (review.state === 'DISMISSED' || review.state === 'CHANGES_REQUESTED') {
        approvers.delete(review.user)
      }
    })

    return approvers
  }

  approvedCount() {
    return this.approvers().size
  }
}
