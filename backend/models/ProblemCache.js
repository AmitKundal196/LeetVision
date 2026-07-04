import mongoose from 'mongoose';

const ProblemCacheSchema = new mongoose.Schema({
  titleSlug: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: '' },
  difficulty: { type: String, default: '' },
  topicTags: [{
    name: { type: String },
    slug: { type: String }
  }]
}, {
  timestamps: true
});

const ProblemCache = mongoose.models.ProblemCache || mongoose.model('ProblemCache', ProblemCacheSchema);
export default ProblemCache;
